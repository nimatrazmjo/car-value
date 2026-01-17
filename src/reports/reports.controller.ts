import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { AdminGuard } from '../guards/admin.guard';
import { ApprovedReportDTO } from './dtos/approved-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Serialize(ReportDTO)
  @Patch('/:id')
  @UseGuards(AuthGaurd, AdminGuard)
  approveReport(
    @CurrentUser() user: User,
    @Body() body: ApprovedReportDTO,
    @Param('id') id: number,
  ) {
    const { approved } = body;
    return this.reportService.approveReport(id, approved, user);
  }

  @Post('')
  @UseGuards(AuthGaurd)
  @Serialize(ReportDTO)
  create(@Body() body: CreateReportDTO, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }

  @Get('')
  @UseGuards(AuthGaurd)
  @Serialize(ReportDTO)
  findAll(@CurrentUser() user: User) {
    return this.reportService.findAll(user);
  }
}
