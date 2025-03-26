import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    MoviesModule, 
    ShowtimesModule,
    BookingsModule,
  ],
})
export class AppModule {}
