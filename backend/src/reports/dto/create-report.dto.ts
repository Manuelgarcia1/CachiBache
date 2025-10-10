import { IsString, IsNotEmpty, IsEnum, IsObject, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportSeverity } from '../entities/report-severity.enum';

// Un DTO anidado para validar las coordenadas
class LocationDto {
    // ✨ --- AÑADIR DECORADORES DE TIPO --- ✨
    @IsNumber()
    @IsNotEmpty()
    x: number;

    // ✨ --- AÑADIR DECORADORES DE TIPO --- ✨
    @IsNumber()
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
}