import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('signature')
  generateSignature(@Body() body: Record<string, any>, @Req() req) {
    const signatureData = this.cloudinaryService.createUploadSignature(body);
    return signatureData;
  }
}
