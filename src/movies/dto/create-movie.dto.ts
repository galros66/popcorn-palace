import { IsString, IsNotEmpty, IsInt, IsPositive, IsNumber, Min } from 'class-validator';
export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()  // check is not empty string
  title: string;
  
  @IsString()
  @IsNotEmpty() // check is not empty string
  genre: string;
  
  @IsInt()
  @IsPositive() // duration must be positive
  duration: number;
  
  @IsNumber()
  @Min(0)  // rating can't be negativ
  rating: number;
  
  @IsInt()
  @Min(1900)  // assume that the movie release year at least in 1900
  releaseYear: number;
}
