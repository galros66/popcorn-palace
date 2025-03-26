import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateShowtimeDto } from 'src/showtimes/dto/create-showtime.dto';
import { CreateMovieDto } from '../src/movies/dto/create-movie.dto';
import { createNewDataSource } from '../src/database/data-source';
import { DataSource } from 'typeorm';

describe('ShowtimesConteoller (e2e)', () => {
  let app: INestApplication;
  let movieId: number;
  let showtimeId: number;
  const movieTitle: string = "Sample Title Movie for Showtimes Test";
  const theaterName: string = "Sample Theater for Showtimes Test";

  let dataSource: DataSource;
  
  const sampleMovie: CreateMovieDto = { 
    title: movieTitle, 
    genre: "Action", 
    duration: 120, 
    rating: 8.7, 
    releaseYear: 2025 
  };

  const sampleShowtime: CreateShowtimeDto = { 
    movieId: movieId, 
    price: 30.2,
    theater: theaterName, 
    startTime: "2025-02-14T11:47:46.125405Z", 
    endTime: "2025-02-14T14:47:46.125405Z" 
  };

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

    movieId = (await request(app.getHttpServer()).post('/movies').send(sampleMovie).expect(200)).body.id;
    sampleShowtime.movieId = movieId;
    showtimeId = (await request(app.getHttpServer()).post('/showtimes').send(sampleShowtime).expect(200)).body.id;

  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });


  it('POST /showtimes - should create a new showtime', async () => {
    
    const showtime: CreateShowtimeDto = { 
      movieId: movieId, 
      price: 20.2,
      theater: "Sample Theater", 
      startTime: "2025-01-14T11:47:46.125405Z", 
      endTime: "2025-01-14T14:47:46.125405Z" 
    };

    const response = await request(app.getHttpServer()).post('/showtimes').send(showtime).expect(200);
    expect(response.body).toMatchObject(showtime); // check the showtime property expect id return properly
    expect(response.body).toHaveProperty('id'); // check id also returned
  });

  it('GET /showtime/:id - should return a showtimes', async () => {
    const response = await request(app.getHttpServer()).get(`/showtimes/${showtimeId}`).expect(200);
    expect(response.body).toMatchObject({
      id: showtimeId,
      movieId: expect.any(Number),
      price: expect.any(Number),
      theater: expect.any(String),
      startTime: expect.any(String),
      endTime: expect.any(String),
    });
  });

  it('POST /showtimes/update/:id - should update a showtime', async () => {
    const updatedShowtime: CreateShowtimeDto = { 
      movieId: movieId, 
      price: 45.5,  // new price
      theater: "Sample Theater", 
      startTime: "2025-02-14T11:47:46.125405Z", 
      endTime: "2025-02-14T14:47:46.125405Z" 
    };
    await request(app.getHttpServer()).post(`/showtimes/update/${showtimeId}`).send(updatedShowtime).expect(200);
    const response = await request(app.getHttpServer()).get(`/showtimes/${showtimeId}`).expect(200); // Get showtime
    expect(response.body).toMatchObject({
      id: showtimeId,
      ...updatedShowtime
    });; // check update saved
  });

  it('DELETE /showtimes/:id - should delete a showtime', async () => {
    await request(app.getHttpServer()).delete(`/showtimes/${showtimeId}`).expect(200); // Delete the showtime
    await request(app.getHttpServer()).delete(`/showtimes/${showtimeId}`).expect(404); // Get NotFoundException
  });

  it('POST /showtimes - should throw BadRequestException when try to create showtime with invalid dto', async () => {

    let showtime: CreateShowtimeDto = { 
      movieId: movieId, 
      price: 20.2,
      theater: "Theater", 
      startTime: "2025-02-14T11:47:46.125405Z", 
      endTime: "2025-02-14T14:47:46.125405Z" 
    };

    showtime.price = -9  // invalid price
    await request(app.getHttpServer()).post('/showtimes').send(showtime).expect(400);
    
    showtime.price = 20.2  // fix price
    showtime.theater = ""  // invalid empty string
    await request(app.getHttpServer()).post('/showtimes').send(showtime).expect(400);

    showtime.theater = "Sample Theater"  // fix theater
    showtime.startTime = '000'  // invalid time
    await request(app.getHttpServer()).post('/movies').send(showtime).expect(400);
  })

  it('POST /showtimes - should throw NotFoundException when try to create showtime with movieId that not exists', async () => {
    let Invalidshowtime: CreateShowtimeDto = { 
      movieId: 999,  // movieId not exists
      price: 20.2,
      theater: "Sample Theater X", 
      startTime: "2025-02-14T11:47:46.125405Z", 
      endTime: "2025-02-14T14:47:46.125405Z" 
    };

    await request(app.getHttpServer()).post('/showtimes').send(Invalidshowtime).expect(404);
  })

  it('POST /showtimes/update/:id - should throw NotFoundException when try to update a showtime that not exists', async () => {
    movieId = (await request(app.getHttpServer()).post('/movies').send(sampleMovie).expect(200)).body.id;
    
    let updateShowtime: CreateShowtimeDto = { 
      movieId: movieId,
      price: 20.2,
      theater: "Sample Theater XX", 
      startTime: "2025-02-14T11:47:46.125405Z", 
      endTime: "2025-02-14T14:47:46.125405Z" 
    };


    await request(app.getHttpServer()).post(`/showtimes/update/999`).send(updateShowtime).expect(404);  // Update showtime that not exists 
  });

  it('POST /showtimes - should throw BadRequestException when create a new invalid showtime with total time smaller than movie duration', async () => {
    movieId = (await request(app.getHttpServer()).post('/movies').send(sampleMovie).expect(200)).body.id;
    
    const invalidShowtime: CreateShowtimeDto = { 
      movieId: movieId, 
      price: 20.2,
      theater: "Sample Theater XXX", 
      startTime: "2025-02-14T13:47:46.125405Z", 
      endTime: "2025-02-14T14:47:46.125405Z",  // total time of the showtime is 1 hour, when movie duration is 2 hours
    };

    await request(app.getHttpServer()).post('/showtimes').send(invalidShowtime).expect(400);
  });

  it('POST /showtimes - should throw BadRequestException when create a new invalid showtime that start before the movie releaseYear', async () => {
    movieId = (await request(app.getHttpServer()).post('/movies').send(sampleMovie).expect(200)).body.id;
    
    const invalidShowtime: CreateShowtimeDto = { 
      movieId: movieId, 
      price: 20.2,
      theater: "Sample Theater XXXX", 
      startTime: "2024-02-14T11:47:46.125405Z", // start in 2024 when movie release in 2025
      endTime: "2024-02-14T14:47:46.125405Z", 
    };

    const response = await request(app.getHttpServer()).post('/showtimes').send(invalidShowtime).expect(400);
  });

  it('Overlapping Showtimes Check - should throw BadRequestException when create or update an invalid showtime that overlapping showtimes for the same theater', async () => {
    movieId = (await request(app.getHttpServer()).post('/movies').send(sampleMovie).expect(200)).body.id;
    
    let showtime: CreateShowtimeDto = { 
      movieId: movieId, 
      price: 20.2,
      theater: "Sample Theater XXXX", 
      startTime: "2025-02-14T11:47:46.125405Z", 
      endTime: "2025-02-14T14:47:46.125405Z",  
    };
    await request(app.getHttpServer()).post('/showtimes').send(showtime).expect(200);
    
    // case of otherShowtime.startTime = showtime.stratTime < otherShowtime.startTime = showtime.stratTime
    await request(app.getHttpServer()).post('/showtimes').send(showtime).expect(400); 
    
    // case of showtime.startTime < otherShowtime.stratTime < otherShowtime.startTime = showtime.stratTime 
    showtime.startTime = "2025-02-14T11:30:46.125405Z";  
    await request(app.getHttpServer()).post('/showtimes').send(showtime).expect(400);
    
    // case of showtime.startTime < otherShowtime.stratTime < showtime.startTime < otherShowtime.stratTime
    showtime.endTime = "2025-02-14T14:40:46.125405Z";  
    await request(app.getHttpServer()).post('/showtimes').send(showtime).expect(400);

    // case of otherShowtime.startTime < showtime.stratTime < showtime.startTime = otherShowtime.stratTime
    showtime.startTime = "2025-02-14T11:50:46.125405Z"; 
    await request(app.getHttpServer()).post('/showtimes').send(showtime).expect(400);

    // case of otherShowtime.startTime < showtime.stratTime < otherShowtime.startTime < showtime.stratTime
    showtime.endTime = "2025-02-14T14:50:46.125405Z";
    await request(app.getHttpServer()).post('/showtimes').send(showtime).expect(400);

    // case of showtime.startTime < otherShowtime.stratTime < showtime.startTime = otherShowtime.stratTime
    showtime.startTime = "2025-02-14T11:30:46.125405Z";
    await request(app.getHttpServer()).post('/showtimes').send(showtime).expect(400);

    // case of showtime.theater != otherShowtime.theater
    showtime.theater = "Sample Theater XXXXX";
    const newShowtimeId = (await request(app.getHttpServer()).post('/showtimes').send(showtime).expect(200)).body.id;

    // case of showtime.theater == otherShowtime.theater after update
    showtime.theater = "Sample Theater XXXX";
    await request(app.getHttpServer()).post(`/showtimes/update/${newShowtimeId}`).send(showtime).expect(400);

    // case of not overlapping showtimes
    showtime.startTime = "2025-02-15T11:50:46.125405Z"; 
    showtime.endTime = "2025-02-15T14:50:46.125405Z";
    await request(app.getHttpServer()).post('/showtimes').send(showtime).expect(200);

  });
});