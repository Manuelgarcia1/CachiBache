import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

// Constante para el token de inyección de dependencias
export const CLOUDINARY = 'Cloudinary';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_NAME'),
      api_key: configService.get('CLOUDINARY_KEY'),
      api_secret: configService.get('CLOUDINARY_SECRET'),
    });
  },
  inject: [ConfigService],
};
