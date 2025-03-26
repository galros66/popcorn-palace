import { DataSource } from 'typeorm';
import { Showtime } from './showtime.entity';

export const showtimeProviders = [
  {
    provide: 'SHOWTIME_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Showtime),
    inject: ['DATA_SOURCE'],
  },
];
