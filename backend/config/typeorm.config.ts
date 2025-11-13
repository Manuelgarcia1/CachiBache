// src/config/typeorm.config.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    const databaseUrl = this.configService.get<string>('DATABASE_URL');

    if (isProduction && databaseUrl) {
      // --- CONFIGURACIÓN PARA PRODUCCIÓN (RAILWAY) ---
      return {
        type: 'postgres',
        url: databaseUrl, // TypeORM maneja la URL completa
        autoLoadEntities: true,
        synchronize: true, // ¡MUY IMPORTANTE! Nunca usar synchronize en producción.
        ssl: {
          rejectUnauthorized: false, // Requerido por Railway para conexiones seguras
        },
        logging: false,
      };
    } else {
      // --- CONFIGURACIÓN PARA DESARROLLO (LOCAL) ---
      return {
        type: 'postgres',
        host: this.configService.get<string>('DB_HOST'),
        port: this.configService.get<number>('DB_PORT'),
        username: this.configService.get<string>('DB_USERNAME'),
        password: this.configService.get<string>('DB_PASSWORD'),
        database: this.configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Sincronizar solo en desarrollo para facilitar cambios
        ssl: false,
        logging: true,
      };
    }
  }
}
