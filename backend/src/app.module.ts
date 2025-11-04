import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '@common/common.module';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';
import { ReportsModule } from '@reports/reports.module';
import { CloudinaryModule } from '@cloudinary/cloudinary.module';
import { AdminModule } from '@admin/admin.module';

@Module({
  imports: [
    // 1. Cargar las variables de entorno de forma global
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigModule esté disponible en toda la app
      envFilePath: '.env', // Especifica la ruta del archivo de configuración
    }),

    // 2. Configurar el módulo de tareas programadas (cron jobs)
    ScheduleModule.forRoot(),

    // 3. Configurar Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 3600000, // 1 hora en milisegundos
        limit: 5, // 5 requests por hora
      },
    ]),

    // 4. Configurar la conexión con la base de datos usando TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importamos ConfigModule para poder inyectar ConfigService
      inject: [ConfigService], // Inyectamos el servicio para leer las variables de entorno
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true, // Carga automáticamente las entidades que definamos
        synchronize: true, // ¡Solo para desarrollo! Sincroniza el esquema de la BD con las entidades
      }),
    }),

    // 5. Módulo común con servicios compartidos
    CommonModule,

    AuthModule,

    UsersModule,

    ReportsModule,

    CloudinaryModule,

    // Módulo de administración (incluye gestión de reportes admin, PDFs, etc.)
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
