import { Expose, Transform } from 'class-transformer';

export class ReportDTO {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  mileage: number;

  @Transform(({ obj }) => {
    return obj?.user?.id;
  })
  @Expose()
  user: number;

  @Expose() approved: boolean;

  @Transform(({ obj }) => {
    return obj?.approvedBy?.id;
  })
  @Expose()
  approvedBy: number;
}
