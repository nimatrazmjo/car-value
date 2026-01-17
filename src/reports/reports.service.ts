import { Injectable, NotFoundException, Patch } from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDTO, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  findAll(user: User) {
    return this.repo
      .createQueryBuilder('report')
      .where('report.user = :userId', { userId: user.id })
      .getMany();
  }

  async approveReport(id: number, approved: boolean, user: User) {
    const report = await this.repo.findOne({ where: { id: id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    report.approvedBy = user;
    return this.repo.save(report);
  }
}
