import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // ✨ --- CONFIGURACIÓN DE CORS --- ✨
  // Permite que el frontend (Expo) se comunique con el backend
  app.enableCors({
    origin: true, // En desarrollo: acepta cualquier origen. En producción: especifica dominios permitidos
    credentials: true, // Permite enviar/recibir cookies (necesario para httpOnly cookies)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // ✨ --- LA CORRECCIÓN MÁS IMPORTANTE ESTÁ AQUÍ --- ✨
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Habilita la transformación automática de DTOs
      transformOptions: {
        enableImplicitConversion: true, // Convierte tipos primitivos automáticamente
      },
    }),
  );

  app.use(cookieParser());
  const port = 3000;
  await app.listen(port);

  console.log(`🚀 Backend corriendo en http://localhost:${port}`);
  console.log(`📡 API disponible en http://localhost:${port}/api`);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
