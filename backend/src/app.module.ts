import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '@common/common.module';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';
import { ReportsModule } from '@reports/reports.module';
import { CloudinaryModule } from '@cloudinary/cloudinary.module';
import { AdminModule } from '@admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TypeOrmConfigService } from './config/typeorm.config';

@Module({
  imports: [
    // 1. Cargar las variables de entorno de forma global
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigModule esté disponible en toda la app
      envFilePath: '.env', // Especifica la ruta del archivo de configuración
    }),

    // 2. Configurar Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 3600000, // 1 hora en milisegundos
        limit: 5, // 5 requests por hora
      },
    ]),

    // 3. Configurar la conexión con la base de datos usando TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService, // Le decimos que use nuestra clase para construir la config
    }),

    // 4. Módulo común con servicios compartidos
    CommonModule,

    AuthModule,

    UsersModule,

    ReportsModule,

    CloudinaryModule,

    // Módulo de administración (incluye gestión de reportes admin, PDFs, etc.)
    AdminModule,

    // Módulo de notificaciones push
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
