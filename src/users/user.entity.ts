import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';

import { Entity, Column, PrimaryGeneratedColumn, AfterInsert } from 'typeorm';

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
}
