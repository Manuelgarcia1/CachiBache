import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsObject,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReportSeverity } from '../entities/report-severity.enum';

// DTO anidado para la ubicación
class LocationDto {
  @IsNumber() @IsNotEmpty() x: number;
  @IsNumber() @IsNotEmpty() y: number;
}

class PhotoDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  publicId: string;
}

export class CreateReportDto {
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ReportSeverity)
  @IsNotEmpty()
  severity: ReportSeverity;

  @IsOptional() // La foto no es obligatoria
  @IsObject()
  @ValidateNested() // Validamos el objeto anidado
  @Type(() => PhotoDto)
  photo?: PhotoDto;
}