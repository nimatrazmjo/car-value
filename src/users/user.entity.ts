import { Report } from '../reports/report.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ default: true })
  admin: boolean;

  @Column()
  password: string;

  @AfterInsert()
  logAfterInsert() {}

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @OneToMany(() => Report, (report) => report.approvedBy)
  approvedReports: Report[];
}
