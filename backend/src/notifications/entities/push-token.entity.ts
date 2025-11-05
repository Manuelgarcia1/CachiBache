import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '@users/entities/user.entity';

@Entity('push_tokens')
export class PushToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column({ default: 'expo' })
  type: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}