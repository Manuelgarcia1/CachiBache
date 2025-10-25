import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider, CloudinaryService],
  controllers: [CloudinaryController],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}