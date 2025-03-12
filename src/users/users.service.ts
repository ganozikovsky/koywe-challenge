import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   *
   *
   * @param {CreateUserDto} createUserDto
   * @return {*}  {Promise<User>}
   * @memberof UsersService
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      username: createUserDto.username,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  /**
   *
   *
   * @param {string} username
   * @return {*}  {(Promise<User | undefined>)}
   * @memberof UsersService
   */
  async findByUsername(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  /**
   *
   *
   * @param {string} id
   * @return {*}  {(Promise<User | undefined>)}
   * @memberof UsersService
   */
  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).exec();
  }
}
