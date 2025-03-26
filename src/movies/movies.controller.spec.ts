import { Test } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';

describe('MoviesController', () => {
  let moviesController: MoviesController;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            addMovie: jest.fn(),
            updateMovie: jest.fn(),
            getAllMovies: jest.fn(),
            deleteMovie: jest.fn(),
          },
        },
      ],
    }).compile();

    moviesService = moduleRef.get(MoviesService);
    moviesController = moduleRef.get(MoviesController);
  });

  describe('addMovie', () => {
    const movie: CreateMovieDto = {
      title: 'Title',
      duration: 100,
      releaseYear: 2025,
      genre: 'Action',
      rating: 9.0,
    };

    it('should return a created movie', async () => {
      const mockMovieResponse = { ...movie, id: 1 };
      jest.spyOn(moviesService, 'addMovie').mockResolvedValue(mockMovieResponse);

      const result = await moviesController.addMovie(movie);

      expect(result).toEqual(mockMovieResponse);
    });
  });

  describe('updateMovie', () => {
    const updateMovie: CreateMovieDto = {
      title: 'Updated Title',
      duration: 120,
      releaseYear: 2026,
      genre: 'Drama',
      rating: 8.5,
    };

    it('should return the updated movie', async () => {
      jest.spyOn(moviesService, 'updateMovie').mockResolvedValue(undefined);

      const result = await moviesController.updateMovie('1', updateMovie);

      expect(result).toBeUndefined();
    });
  });

  describe('getAllMovies', () => {
    it('should return a list of movies', async () => {
      const mockMoviesList = [
        { id: 1, title: 'Movie 1', duration: 90, releaseYear: 2020, genre: 'Comedy', rating: 7.5 },
        { id: 2, title: 'Movie 2', duration: 110, releaseYear: 2022, genre: 'Action', rating: 8.0 },
      ];
      jest.spyOn(moviesService, 'getAllMovies').mockResolvedValue(mockMoviesList);

      const result = await moviesController.getAllMovies();

      expect(result).toEqual(mockMoviesList);
    });
  });

  describe('deleteMovie', () => {
    it('should not return', async () => {
      const mockResponse = { message: 'Movie deleted successfully' };
      jest.spyOn(moviesService, 'deleteMovie').mockResolvedValue(undefined);

      const result = await moviesController.deleteMovie('Title');

      expect(result).toBeUndefined();
    });
  });
});
