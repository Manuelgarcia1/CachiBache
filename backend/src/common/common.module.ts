import { Module, Global } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { EmailService } from './services/email.service';

@Global() // Hace que este módulo sea global, disponible en toda la aplicación
@Module({
  providers: [EncryptionService, EmailService],
  exports: [EncryptionService, EmailService], // Exporta para que otros módulos puedan usarlo
})
export class CommonModule {}
