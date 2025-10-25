import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('signature')
  generateSignature(@Body() body: Record<string, any>, @Req() req) {
    // 👇 Añadimos logs para saber que la petición llegó y con qué datos
    console.log(`[Cloudinary Controller] Petición de firma recibida del usuario: ${req.user.id}`);
    console.log(`[Cloudinary Controller] Parámetros para firmar:`, body);
    
    const signatureData = this.cloudinaryService.createUploadSignature(body);
    
    console.log('[Cloudinary Controller] ✅ Firma generada exitosamente.');
    return signatureData;
  }
}