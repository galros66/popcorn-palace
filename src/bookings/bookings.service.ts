import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { ShowtimesService } from '../showtimes/showtimes.service';

@Injectable()
export class BookingsService {
  constructor(
    @Inject('BOOKING_REPOSITORY')
    private bookingsRepository: Repository<Booking>,
    private readonly showtimesService: ShowtimesService
  ) {}
  
  async addBooking(booking: CreateBookingDto): Promise<object> {
    // check if the showtime exists
    if (! await this.showtimesService.getShowtime(booking.showtimeId)) {
      throw new NotFoundException(`Invalid Input: Showtime with ID ${booking.showtimeId} Not Found!`);
    }
    // check if the seat number is already booked
    if (await this.checkBookingExist(booking.showtimeId, booking.seatNumber)) {
      throw new BadRequestException(`Invalid Input: The Seat Number ${booking.seatNumber} is already booked in showtime with ID ${booking.showtimeId}.`)
        
    }
    // create new booking
    const newBooking = this.bookingsRepository.create(
      {
        showtimeId: booking.showtimeId,
        seatNumber: booking.seatNumber,
        userId: booking.userId
      }
    )
    // save the booking in the repository (let 'typeorm' generate a unique key - bookingId)
    await this.bookingsRepository.save(newBooking)
    // return the id of the new booking
    return {'bookingId': newBooking.bookingId}
  }

  async checkBookingExist(showtimeId: number, seatNumber: number): Promise<boolean> {
    // count the number of the bookings with same showtime and seat number (should be at most 1)
    const conflictingShowtimes = await this.bookingsRepository.createQueryBuilder('booking')
      .where(
        '(booking.showtimeId = :showtimeId AND booking.seatNumber = :seatNumber)', 
        { showtimeId, seatNumber }
      )
      .getCount();
    // return true if the seat alreadt booked
    return conflictingShowtimes > 0; 
  }

}