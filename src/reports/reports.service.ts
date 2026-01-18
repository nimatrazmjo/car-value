import { Injectable, NotFoundException, Patch } from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  getEstimage(estimate: GetEstimateDTO) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: estimate.make })
      .andWhere('model = :model', { model: estimate.model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: estimate.lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: estimate.lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year: estimate.year })
      .andWhere('approved IS TRUE')
      .orderBy('mileage - :mileage', 'DESC')
      .setParameters({ mileage: estimate.mileage })
      .getRawOne();
  }

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
