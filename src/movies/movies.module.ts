// movies.module.ts
import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { DatabaseModule } from '../database/database.module';
import { movieProviders } from './movie.providers';

@Module({
  imports: [DatabaseModule], 
  providers: [
    ...movieProviders,
    MoviesService
  ], 
  controllers: [MoviesController], 
  exports: [MoviesService]
})
export class MoviesModule {}
