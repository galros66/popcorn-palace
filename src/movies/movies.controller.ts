// movies.controller.ts
import { Controller, Get, Post, Body, Param, Delete, HttpCode } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from '../movies/dto/create-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // Get all movies
  @Get('all')
  @HttpCode(200)
  async getAllMovies() {
    return this.moviesService.getAllMovies();
  }

  // Add a new movie
  @Post()
  @HttpCode(200)
  async addMovie(@Body() movie: CreateMovieDto) {
    return this.moviesService.addMovie(movie);
  }

  // Delete a movie by title
  @Delete(':title')
  @HttpCode(200)
  async deleteMovie(@Param('title') title: string) {
    return this.moviesService.deleteMovie(title);
  }

  // Update a movie by title
  @Post('update/:title')
  @HttpCode(200)
  async updateMovie(@Param('title') title: string, @Body() movie: CreateMovieDto) {
    return this.moviesService.updateMovie(title, movie);
  }
}
