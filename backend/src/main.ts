import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);

  // ✨ --- CONFIGURACIÓN DE CORS --- ✨
  // Permite que el frontend (Expo) se comunique con el backend
  const frontendUrl = configService.get<string>('FRONTEND_URL');
  app.enableCors({
    // 3. En producción, solo permite el origen del frontend
    origin: [frontendUrl, 'http://localhost:8081'], // localhost:8081 para Expo Go
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
  const host = '0.0.0.0'; // Escucha en todas las interfaces de red disponibles
  const port = configService.get<number>('PORT') || 3000; // Usa el puerto de la variable de entorno

  await app.listen(port, host);

  console.log(`🚀 El backend de Cachi-Bache está corriendo en: http://${host}:${port}`);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
