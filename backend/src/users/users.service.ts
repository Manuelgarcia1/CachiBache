import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(registerUserDto: RegisterUserDto): Promise<User> {
        const newUser = this.userRepository.create(registerUserDto);
        return this.userRepository.save(newUser);
    }
    async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }
    async findOneById(id: string): Promise<User | null> {
        return this.userRepository.findOneBy({ id });
    }

    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
}
