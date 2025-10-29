import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  /**
   * Genera una firma segura para autorizar una subida directa desde el cliente.
   * @param paramsToSign Parámetros que el cliente necesita firmar (ej: public_id, folder).
   */
  createUploadSignature(paramsToSign: Record<string, any>): {
    signature: string;
    timestamp: number;
    api_key: string;
  } {
    const timestamp = Math.round(new Date().getTime() / 1000);

    if (!process.env.CLOUDINARY_SECRET) {
      throw new Error('CLOUDINARY_SECRET environment variable is not defined');
    }

    if (!process.env.CLOUDINARY_KEY) {
      throw new Error('CLOUDINARY_KEY environment variable is not defined');
    }

    const signature = cloudinary.utils.api_sign_request(
      { ...paramsToSign, timestamp },
      process.env.CLOUDINARY_SECRET,
    );

    const apiKey = process.env.CLOUDINARY_KEY;

    return {
      signature,
      timestamp,
      api_key: apiKey,
    };
  }
}
