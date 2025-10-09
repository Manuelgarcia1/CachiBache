import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        // El hasheo es automático gracias al hook @BeforeInsert en la entidad.
        const newUser = this.userRepository.create(createUserDto);
        return this.userRepository.save(newUser);
    }
    async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }
    async findOneById(id: string): Promise<User | null> {
        return this.userRepository.findOneBy({ id });
    }
}