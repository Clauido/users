import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(data: any): Promise<User> {
    // console.log(data.birthDay);
    // data.birthDay = new Date(data.birthDay);
    // console.log(data.birthDay);
    // in this case the date also will be resend with the format -> DD-MM-YYYYY
    return this.userRepository.save(data);
  }
  async findOne(condition: any): Promise<User> {
    return this.userRepository.findOne(condition);
  }
}
