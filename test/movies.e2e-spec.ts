import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateMovieDto } from '../src/movies/dto/create-movie.dto';
import { createNewDataSource} from '../src/database/data-source';
import { DataSource } from 'typeorm';

describe('MoviesConteoller (e2e)', () => {
  let app: INestApplication;
  let movieTitle: string = "Sample Title Movie for Movies Test";
  const sampleMovie: CreateMovieDto = { 
    title: movieTitle, 
    genre: "Action", 
    duration: 120, 
    rating: 8.7, 
    releaseYear: 2025 
  };

  let dataSource: DataSource;

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
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });


  it('POST /movies - should create a new movie', async () => {
    const movieToCreate: CreateMovieDto = { 
      title: "Sample Movie Title", 
      genre: "Action", 
      duration: 120, 
      rating: 8.7, 
      releaseYear: 2025 
    };

    const response = await request(app.getHttpServer()).post('/movies').send(movieToCreate).expect(200);
    expect(response.body).toMatchObject(movieToCreate); // check the movie property expect id return properly
    expect(response.body).toHaveProperty('id'); // check id also returned
  });

  it('GET /movies/all - should return an array of movies', async () => {
    const response = await request(app.getHttpServer()).get('/movies/all').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /movies/update/:title - should update a movie', async () => {
    await request(app.getHttpServer()).post('/movies').send(sampleMovie).expect(200);  // create a new movie
    
    const updatedMovie: CreateMovieDto = { 
      title: "Updated Sample Movie Title", 
      genre: "Action", 
      duration: 100, 
      rating: 5.2, 
      releaseYear: 2024 
    }

    await request(app.getHttpServer()).post(`/movies/update/${movieTitle}`).send(updatedMovie).expect(200);
    const response = await request(app.getHttpServer()).get('/movies/all').expect(200); // Get all the movies after delete a movie
    expect(response.body.some(movie => movie.title === updatedMovie.title)).toBe(true); // check if the movie in the movies array
  });

  it('DELETE /movies/:title - should delete a movie', async () => {
    await request(app.getHttpServer()).post('/movies').send(sampleMovie).expect(200); // create new movie

    await request(app.getHttpServer()).delete(`/movies/${movieTitle}`).expect(200); // Delete the movie
    await request(app.getHttpServer()).delete(`/movies/${movieTitle}`).expect(404); // Get NotFoundException
  });

  it('POST /movies - should throw BadRequestException when try to create movie with invalid dto', async () => {
    let movieWithInvalidDto: CreateMovieDto = { 
        title: "Sample Movie Title", 
        genre: "Action", 
        duration: 120, 
        rating: 2.0,  // nagativ rating
        releaseYear: 2025 
    };

    movieWithInvalidDto.rating = -2.0
    await request(app.getHttpServer()).post('/movies').send(movieWithInvalidDto).expect(400);
    
    movieWithInvalidDto.rating = 2.5  // fix rating
    movieWithInvalidDto.title = ""  // invalid empty string
    await request(app.getHttpServer()).post('/movies').send(movieWithInvalidDto).expect(400);

    movieWithInvalidDto.title = "Sample Movie Title"  // fix title
    movieWithInvalidDto.releaseYear = 0  // invalid year
    await request(app.getHttpServer()).post('/movies').send(movieWithInvalidDto).expect(400);
  })

  it('POST /movies/update/:title - should throw NotFoundException when try to update a movie that not exists', async () => {
    const updatedMovie: CreateMovieDto = { 
        title: "Updated Sample Movie Title", 
        genre: "Action", 
        duration: 100, 
        rating: 5.2, 
        releaseYear: 2024 
    }

    await request(app.getHttpServer()).post(`/movies/update/Movie Title that not exists`).send(updatedMovie).expect(404);  // Update movie that not exists 
  });

});
