import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✨ --- AÑADIR ESTA LÍNEA --- ✨
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // No permite propiedades que no estén en el DTO
    forbidNonWhitelisted: true, // Lanza error si se envían propiedades no permitidas
  }));
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();