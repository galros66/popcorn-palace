import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { Repository } from 'typeorm';
import { Showtime } from './showtime.entity';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class ShowtimesService {

  constructor(
    @Inject('SHOWTIME_REPOSITORY')
    private showtimesRepository: Repository<Showtime>,
    private readonly moviesService: MoviesService
  ) {}

  async getShowtime(showtimeId: number): Promise<Showtime>{
    const showtime = await this.showtimesRepository.findOne( {where: {id: showtimeId}});
    // check if showtime exists
    if (!showtime) {
      throw new NotFoundException(`Invalid Input: Showtime with ID ${showtimeId} Not Found!`);
    }
    return showtime;
  }
  
  async addShowtime(showtime: CreateShowtimeDto): Promise<Showtime> {
    // create new showtime
    const newShowtime = this.showtimesRepository.create(
      {
        price: showtime.price,
        movieId: showtime.movieId,
        theater: showtime.theater,
        startTime: showtime.startTime,
        endTime: showtime.endTime
      }
    )
    // check if is valid showtime
    await this.isValidShowtime(newShowtime)
    // save to repository
    await this.showtimesRepository.save(newShowtime)
    // return new showtime
    return newShowtime;
  }

  async updateShowtime(showtimeId: number, updatedShowtime: CreateShowtimeDto): Promise<void> {
    // check if the showtime exists
    const existingShowtime: Showtime = await this.showtimesRepository.findOne({ where: { id: showtimeId } });
    if (!existingShowtime) {
      throw new NotFoundException(`Invalid Input: Showtime with ID ${showtimeId} Not Found!`);
    }
    // update the showtime
    existingShowtime.price = updatedShowtime.price;
    existingShowtime.movieId = updatedShowtime.movieId;
    existingShowtime.theater = updatedShowtime.theater;
    existingShowtime.startTime = updatedShowtime.startTime;
    existingShowtime.endTime = updatedShowtime.endTime;
    // check if the showtime is valid
    await this.isValidShowtime(existingShowtime)
    // save to the repository
    await this.showtimesRepository.save(existingShowtime);
  }

  async checkForShowtimeConflicts(showtimeId: number, startTime: Date, endTime: Date, theater: string): Promise<boolean> {
    let queryBuilder = this.showtimesRepository.createQueryBuilder('showtime')
      .where( // filter all the showtimes with the theater that received
        'showtime.theater = :theater',
        { theater }
      ).andWhere( // filter all the showtime that overlapping the time frame that received 
        `CAST(showtime.startTime AS TIMESTAMP) < CAST(:endTime AS TIMESTAMP) 
        AND CAST(showtime.endTime AS TIMESTAMP) > CAST(:startTime AS TIMESTAMP)`,
        { startTime, endTime }
      );
    
    // the showtimeId is undefind if call the function for new showtime, so that check be only to update movie.
    if (showtimeId){
      // Filter all the other showtimes with different id
      queryBuilder = queryBuilder.andWhere('showtime.id != :showtimeId', { showtimeId })
    }
    // return if showtime is overlapping other showtime.
    const conflictingShowtimes = await queryBuilder.getCount()
    return conflictingShowtimes > 0; 
  }

  async isValidShowtime(showtime: Showtime): Promise<void> {
    
    const movie = await this.moviesService.getMovie(showtime.movieId);
    const startTime = new Date(showtime.startTime);
    const endTime = new Date(showtime.endTime); 
    const diffInMinutes = (endTime.getTime() - startTime.getTime()) / (60 * 1000);

    // Check if movie exists
    if (! movie) {
      throw new NotFoundException(`Invalid Input: Movie with ID ${showtime.movieId} Not Found!`);
    }
    
    // Check if the movie release year fit to the start year.
    if (startTime.getFullYear() < movie.releaseYear) {
      throw new BadRequestException('Invalid Input: The movie release year not fit to the start time showtime.')
    }
    // Check if the startTime and endTime are sufficient for the movie duration.
    if (diffInMinutes < movie.duration) {
      throw new BadRequestException('Invalid Input: The start time and end time of the showtime are not sufficient for the movie duration.');
    }

    // Check if there is a overlapping showtimes.
    if (await this.checkForShowtimeConflicts(showtime.id, startTime, endTime, showtime.theater)) {
        throw new BadRequestException(`Invalid Input: Overlapping showtimes for the same theater with ID ${showtime.theater}!`);
        
    }

  }

  async deleteShowtime(showtimeId: number): Promise<void> {
    const result = await this.showtimesRepository.delete({ id: showtimeId })
    // check if showtime was exists and delete
    if ( result.affected === 0) {
      throw new NotFoundException(`Invalid Input: Showtime with ID ${showtimeId} Not Found!`)
    }
  }

}