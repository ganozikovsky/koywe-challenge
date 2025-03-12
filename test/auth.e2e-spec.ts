import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
  ResponseInterceptor,
} from '../src/common';
import { User } from '../src/users/schemas/user.schema';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userModel;

  beforeAll(async () => {
    // Use in-memory MongoDB for testing
    const mongoUri = 'mongodb://127.0.0.1:27017/koywe-test';
    await mongoose.connect(mongoUri);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue(mongoose.model(User.name, mongoose.Schema({})))
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

    app.useGlobalInterceptors(new ResponseInterceptor());

    await app.init();

    userModel = moduleFixture.get(getModelToken(User.name));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await app.close();
  });

  describe('Auth Flow', () => {
    const testUser = {
      username: 'testuser',
      password: 'Password123!',
    };

    beforeEach(async () => {
      await userModel.deleteMany({});
    });

    it('/auth/register (POST) should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect(({ body }) => {
          expect(body).toHaveProperty('data');
          expect(body.data).toHaveProperty('username', testUser.username);
          expect(body.data).not.toHaveProperty('password');
          expect(body).toHaveProperty('meta');
          expect(body.meta).toHaveProperty('statusCode', 201);
        });
    });

    it('/auth/login (POST) should return a JWT token for valid credentials', async () => {
      await request(app.getHttpServer()).post('/auth/register').send(testUser);

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(testUser)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveProperty('access_token');
          expect(typeof body.access_token).toBe('string');
        });
    });

    it('/auth/login (POST) should return 401 for invalid credentials', async () => {
      await request(app.getHttpServer()).post('/auth/register').send(testUser);

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: testUser.username,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });
});
