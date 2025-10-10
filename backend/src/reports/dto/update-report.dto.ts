import { IsString, IsOptional, IsEnum, IsObject, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportSeverity } from '../entities/report-severity.enum';
import { ReportStatus } from '../entities/report-status.enum';

class LocationDto {
    @IsNumber()
    x: number;

    @IsNumber()
    y: number;
}

export class UpdateReportDto {
    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => LocationDto)
    location?: LocationDto;

    @IsOptional()
    @IsEnum(ReportSeverity)
    severity?: ReportSeverity;

    @IsOptional()
    @IsEnum(ReportStatus)
    status?: ReportStatus;
}
