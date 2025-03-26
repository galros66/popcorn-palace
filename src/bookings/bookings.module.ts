// bookings.module.ts
import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { DatabaseModule } from '../database/database.module';
import { bookingProviders } from './booking.providers';

@Module({
  imports: [
    DatabaseModule,
    ShowtimesModule
  ], 
  providers: [
    ...bookingProviders,
    BookingsService
  ], 
  controllers: [BookingsController], 
  exports: [BookingsService]
})
export class BookingsModule {}