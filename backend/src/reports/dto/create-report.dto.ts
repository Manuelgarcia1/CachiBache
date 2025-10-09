import { IsString, IsNotEmpty, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportSeverity } from '../entities/report-severity.enum';

// Un DTO anidado para validar las coordenadas
class LocationDto {
  @IsNotEmpty()
  x: number;

  @IsNotEmpty()
  y: number;
}

export class CreateReportDto {
  @IsObject()
  @ValidateNested() // Le dice al validador que también valide el objeto anidado
  @Type(() => LocationDto) // Le dice a class-transformer qué clase usar para la transformación
  location: LocationDto;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(ReportSeverity)
  @IsNotEmpty()
  severity: ReportSeverity;
  
  // NOTA: En un sistema real con autenticación, el userId se obtendría del token JWT,
  // no se pasaría en el body. Por ahora lo incluimos para poder asociar el reporte.
  @IsString()
  @IsNotEmpty()
  userId: string;
}