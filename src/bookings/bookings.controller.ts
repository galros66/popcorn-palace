// bookings.controller.ts
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}
  
  // Add a new booking
  @Post()
  @HttpCode(200)
  async addBooking(@Body() booking: CreateBookingDto) {
    return this.bookingsService.addBooking(booking);
  }

}