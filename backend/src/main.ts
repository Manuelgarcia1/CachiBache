import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  
  // ✨ --- LA CORRECCIÓN MÁS IMPORTANTE ESTÁ AQUÍ --- ✨
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // Habilita la transformación automática de DTOs
    transformOptions: {
      enableImplicitConversion: true, // Convierte tipos primitivos automáticamente
    },
  }));

  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();