import { Module, Global } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';

@Global() // Hace que este módulo sea global, disponible en toda la aplicación
@Module({
  providers: [EncryptionService],
  exports: [EncryptionService], // Exporta para que otros módulos puedan usarlo
})
export class CommonModule {}
