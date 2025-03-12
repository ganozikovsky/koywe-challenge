import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import {
  HttpExceptionFilter,
  AllExceptionsFilter,
  ResponseInterceptor,
} from './common';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Koywe Currency Conversion API')
    .setDescription('API for converting between fiat and cryptocurrencies')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable CORS
  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.port;

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
