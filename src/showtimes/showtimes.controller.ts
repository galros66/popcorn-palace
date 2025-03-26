// showtimes.controller.ts
import { Controller, Get, Post, Body, Param, Delete, HttpCode } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  // Get showtime by id
  @Get(':id')
  @HttpCode(200)
  async getShowtime(@Param('id') id: number) {
    return this.showtimesService.getShowtime(id);
  }

  // Add a new showtime
  @Post()
  @HttpCode(200)
  async addShowtime(@Body() showtime: CreateShowtimeDto) {
    return this.showtimesService.addShowtime(showtime);
  }

  // Delete a showtime by id
  @Delete(':id')
  @HttpCode(200)
  async deleteShowtime(@Param('id') id: number) {
    return this.showtimesService.deleteShowtime(id);
  }

  // Update a showtime by id
  @Post('update/:id')
  @HttpCode(200)
  async updateShowtime(@Param('id') id: number, @Body() showtime: CreateShowtimeDto) {
    return this.showtimesService.updateShowtime(id, showtime);
  }
}
