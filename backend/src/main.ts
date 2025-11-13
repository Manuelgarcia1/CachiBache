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
  const frontendUrlProd = configService.get<string>('FRONTEND_URL');
  app.enableCors({
    origin: (origin, callback) => {
      // Lista de patrones que identifican un origen de desarrollo local
      const devPatterns = [
        /^http:\/\/localhost(:\d+)?$/, // localhost con o sin puerto
        /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/, // IPs locales comunes
        /^exp:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/, // Expo Go
      ];

      // Permite la URL de producción
      if (origin === frontendUrlProd) {
        return callback(null, true);
      }

      // Permite peticiones sin origen (como Postman)
      if (!origin) {
        return callback(null, true);
      }
      
      // Comprueba si el origen coincide con alguno de los patrones de desarrollo
      const isDevOrigin = devPatterns.some((pattern) => pattern.test(origin));

      if (isDevOrigin) {
        return callback(null, true);
      }

      // Si no coincide con nada, la rechaza
      console.warn(`[CORS] Petición rechazada desde origen no permitido: ${origin}`);
      callback(new Error('Origen no permitido por políticas de CORS'));
    },
    credentials: true,
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
