import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';

@Injectable()
export class MoviesService {
  
  constructor(
    @Inject('MOVIE_REPOSITORY')
    private moviesRepository: Repository<Movie>
  ) {}

  async getAllMovies(): Promise<Movie[]>{
    // return all the movies in the repository
    return this.moviesRepository.find();
  }
  
  async getMovie(id: number): Promise<Movie> {
    // return movie if the movie exsits
    return await this.moviesRepository.findOne({ where: { id }});
  }
  
  async addMovie(movie: CreateMovieDto): Promise<Movie> {
    // create new movie
    const newMovie = this.moviesRepository.create(
      {
        title: movie.title,
        genre: movie.genre,
        duration: movie.duration,
        rating: movie.rating,
        releaseYear: movie.releaseYear
      }
    )
    // save the new movie into the repository
    await this.moviesRepository.save(newMovie)
    // return the new movie
    return newMovie
  }

  async updateMovie(title: string, updatedMovie: CreateMovieDto): Promise<void> {
    const existingMovie: Movie = await this.moviesRepository.findOne({ where: { title } });
    // check if th movie exists
    if (!existingMovie) {
      throw new NotFoundException(`Invalid Input: Movie with '${title}' title Not Found!`);
    }
    // update the movie
    existingMovie.title = updatedMovie.title;
    existingMovie.genre = updatedMovie.genre;
    existingMovie.duration = updatedMovie.duration;
    existingMovie.rating = updatedMovie.rating;
    existingMovie.releaseYear = updatedMovie.releaseYear;
    // save the changes
    await this.moviesRepository.save(existingMovie);
  }
  
  async deleteMovie(title: string): Promise<void> {
    const result = await this.moviesRepository.delete({ title })
    // check if the movie delete, if not the movie is not exists
    if ( result.affected === 0) {
      throw new NotFoundException(`Invalid Input: Movie with '${title}' title Not Found!`)
    }
  }

}
