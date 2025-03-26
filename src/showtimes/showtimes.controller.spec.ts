import { Test } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

describe('ShowtimesController', () => {
  let showtimesController: ShowtimesController;
  let showtimesService: ShowtimesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: {
            addShowtime: jest.fn(),
            updateShowtime: jest.fn(),
            getShowtime: jest.fn(),
            deleteShowtime: jest.fn(),
          },
        },
      ],
    }).compile();
      
    showtimesService = moduleRef.get(ShowtimesService);
    showtimesController = moduleRef.get(ShowtimesController);
  });
  
  describe('addShowtime', () => {
      const showtime: CreateShowtimeDto = { 
          movieId: 1, 
          price: 20.2, 
          theater: "Sample Theater", 
          startTime: "2025-02-14T11:47:46.125405Z", 
          endTime: "2025-02-14T14:47:46.125405Z" 
      };
  
      it('should return a showtime object', async () => {
        const mockShowtimeResponse = {
          movieId: 1, 
          price: 20.2, 
          theater: "Sample Theater", 
          startTime: "2025-02-14T11:47:46.125405Z", 
          endTime: "2025-02-14T14:47:46.125405Z",
          id: 1,
        };
        jest.spyOn(showtimesService, 'addShowtime').mockResolvedValue(mockShowtimeResponse);
  
        const result = await showtimesController.addShowtime(showtime);
  
        expect(result).toEqual(mockShowtimeResponse);
      });
    });
  
    describe('updateShowtime', () => {
      const updatedShowtime: CreateShowtimeDto = { 
          movieId: 2, 
          price: 45.8, 
          theater: "Update Theater", 
          startTime: "2025-02-14T11:47:46.125405Z", 
          endTime: "2025-02-14T14:47:46.125405Z" 
      };
  
      it('should return the updated showtime object', async () => {

        jest.spyOn(showtimesService, 'updateShowtime').mockResolvedValue(undefined);
  
        const result = await showtimesController.updateShowtime(1, updatedShowtime);
  
        expect(result).toBeUndefined();
      });
    });
  
    describe('getShowtime', () => {
      it('should return a showtime object', async () => {
        const mockShowtimeResponse = {
          movieId: 2, 
          price: 20.4, 
          theater: "Theater", 
          startTime: "2025-02-14T11:47:46.125405Z", 
          endTime: "2025-02-14T14:47:46.125405Z",
          id: 1,
        };
        jest.spyOn(showtimesService, 'getShowtime').mockResolvedValue(mockShowtimeResponse);
  
        const result = await showtimesController.getShowtime(1);
  
        expect(result).toEqual(mockShowtimeResponse);
      });
    });
  
    describe('deleteShowtime', () => {
      it('should return a success message', async () => {
        const mockResponse = { message: 'Showtime deleted successfully' };
        jest.spyOn(showtimesService, 'deleteShowtime').mockResolvedValue(undefined);
  
        const result = await showtimesController.deleteShowtime(1);
  
        expect(result).toBeUndefined();
      });
    });

})