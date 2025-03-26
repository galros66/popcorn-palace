import { IsString, IsNotEmpty, IsInt, IsNumber, Min, IsDateString } from 'class-validator';

export class CreateShowtimeDto {
  @IsNumber()
  @Min(0) // The price can't be negativ
  price: number;
  
  @IsInt()
  movieId: number;

  @IsString()
  @IsNotEmpty() // can't be empty string 
  theater: string;

  @IsDateString() // must be in date format
  startTime: string;

  @IsDateString() // must be in date format
  endTime: string;
}