import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
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

  @Column()
  password: string;

  @AfterInsert()
  logAfterInsert() {}

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
