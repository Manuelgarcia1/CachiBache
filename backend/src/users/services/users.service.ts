import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { EncryptionService } from '@common/services/encryption.service';
import { classToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password) {
      createUserDto.password = await this.encryptionService.hashPassword(
        createUserDto.password,
      );
    }

    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    // Búsqueda case-insensitive usando query builder
    return this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async updateProfile(userId: string, updateData: Partial<User>): Promise<any> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Actualizar solo los campos proporcionados
    Object.assign(user, updateData);

    const updatedUser = await this.userRepository.save(user);
    return classToPlain(updatedUser);
  }
}
