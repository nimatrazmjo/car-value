import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGaurd } from 'src/guards/auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post('')
  @UseGuards(AuthGaurd)
  create(@Body() body: CreateReportDTO) {
    return this.reportService.create(body);
  }
}
