import { Module, Global } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { EmailService } from './services/email.service';
import { HtmlResponseService } from './services/html-response.service';

@Global() // Hace que este módulo sea global, disponible en toda la aplicación
@Module({
  providers: [EncryptionService, EmailService, HtmlResponseService],
  exports: [EncryptionService, EmailService, HtmlResponseService], // Exporta para que otros módulos puedan usarlo
})
export class CommonModule {}
