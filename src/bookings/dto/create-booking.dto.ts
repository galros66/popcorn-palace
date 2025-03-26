import { IsInt, IsPositive, IsUUID} from 'class-validator';

export class CreateBookingDto {
  @IsInt()  // assume that the movie id is integer like the example in the README.md showtimes API
  showtimeId: number;
  
  @IsUUID()  // assume that the user id is uuid like the example in the README.md bookings API 
  userId: string;

  @IsInt()
  @IsPositive() // Seat number must be positive integer
  seatNumber: number;
}