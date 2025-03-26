// showtimes.module.ts
import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { MoviesModule } from '../movies/movies.module';
import { DatabaseModule } from '../database/database.module';
import { showtimeProviders } from './showtime.providres';

@Module({
  imports: [
    DatabaseModule,
    MoviesModule
  ], 
  providers: [
    ...showtimeProviders,
    ShowtimesService
  ], 
  controllers: [ShowtimesController], 
  exports: [ShowtimesService]
})
export class ShowtimesModule {}