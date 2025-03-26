import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { CreateShowtimeDto } from 'src/showtimes/dto/create-showtime.dto';
import { CreateBookingDto } from 'src/bookings/dto/create-booking.dto';
import { createNewDataSource } from '../src/database/data-source';
import { DataSource } from 'typeorm';

describe('BookingsConteoller (e2e)', () => {
  let app: INestApplication;
  let movieId: number;
  let showtimeId: number;
  let dataSource: DataSource
  
  const sampleMovie: CreateMovieDto = { 
    title: "Sample Title Movie for Bookings Test", 
    genre: "Action", 
    duration: 120, 
    rating: 8.7, 
    releaseYear: 2025 
  };

  const sampleShowtime: CreateShowtimeDto = { 
    movieId: movieId, 
    price: 30.2,
    theater: "Sample Theater for Bookings Test", 
    startTime: "2025-02-14T11:47:46.125405Z", 
    endTime: "2025-02-14T14:47:46.125405Z" 
  };
  
  const sampleBooking: CreateBookingDto = { 
    showtimeId: showtimeId, 
    seatNumber: 1,
    userId:"84438967-f68f-4fa0-b620-0f08217e76ac",
  };

  const initDatabase = async () => {
    sampleShowtime.movieId = (await request(app.getHttpServer()).post('/movies').send(sampleMovie).expect(200)).body.id;
    showtimeId = (await request(app.getHttpServer()).post('/showtimes').send(sampleShowtime).expect(200)).body.id;
    sampleBooking.showtimeId = showtimeId;
    await request(app.getHttpServer()).post('/bookings').send(sampleBooking).expect(200);
  }

  beforeAll(async () => {
    dataSource = await createNewDataSource().initialize();
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })

    .overrideProvider('DATA_SOURCE')
    .useValue(dataSource)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await initDatabase();
  });


  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });


  it('POST /bookings - should create a new booking', async () => {
    const booking: CreateBookingDto = { 
        showtimeId: showtimeId, 
        seatNumber: 15,
        userId:"84438967-f68f-4fa0-b620-0f08217e76af",
    };

    const response = await request(app.getHttpServer()).post('/bookings').send(booking).expect(200);
    expect(response.body).toHaveProperty('bookingId'); // check id returned
  });

  
  it('POST /bookings - should throw NotFoundException when try create an invalid booking with showtime that not exists', async () => {
    const booking: CreateBookingDto = { 
        showtimeId: 999, 
        seatNumber: 16,
        userId:"84438967-f68f-4fa0-b620-0f08214e76af",
    };

    await request(app.getHttpServer()).post('/bookings').send(booking).expect(404);
  });

  it('POST /bookings - should throw BadRequestException when try to make duoble booking to same seat number', async () => {
    const booking: CreateBookingDto = { 
        showtimeId: showtimeId, 
        seatNumber: 1,
        userId:"84438967-f68f-4fa0-b620-0f08214e76af",
    };

    await request(app.getHttpServer()).post('/bookings').send(booking).expect(400);
  });

});