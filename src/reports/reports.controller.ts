import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGaurd } from '../guards/auth.guard';
import { CurrentUser } from '../users/decoraters/current-user.decorator';
import { User } from '../users/user.entity';

import { Serialize } from '../intercepters/serialize.interceptor';
import { ReportDTO } from '../reports/dtos/report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post('')
  @UseGuards(AuthGaurd)
  @Serialize(ReportDTO)
  create(@Body() body: CreateReportDTO, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }
}
