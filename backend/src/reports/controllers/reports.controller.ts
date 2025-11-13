import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Query,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { EmailVerifiedGuard } from '@auth/guards/email-verified.guard';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { User } from '@users/entities/user.entity';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard) // Requiere autenticación Y email verificado
  create(
    @Body() createReportDto: CreateReportDto,
    @GetUser() user: User, // 5. Obtener el usuario del token
  ) {
    return this.reportsService.create(createReportDto, user);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  findReportsByUser(
    @GetUser() user: User, // Usa el decorador para obtener el usuario del token
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.reportsService.findReportsByUserId(
      user.id, // Usa el id del usuario autenticado
      +page,
      +limit,
      search,
    );
  }

  @Get(':reportId')
  @UseGuards(JwtAuthGuard)
  findOneReport(@Param('reportId', ParseUUIDPipe) reportId: string) {
    return this.reportsService.findOneReport(reportId);
  }

  @Patch(':reportId')
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard) // Requiere email verificado para actualizar
  updateReport(
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportsService.updateReport(reportId, updateReportDto);
  }
}
