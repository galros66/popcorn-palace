import { Test } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingsController', () => {
  let bookingsController: BookingsController;
  let bookingsService: BookingsService;

  // before each test case creating new testing module, bookingsServie and bookingsController objects  
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [BookingsController],
        providers: [
            {
                provide: BookingsService,
                useValue: {
                  addBooking: jest.fn(),
                },
              },
        ],
      }).compile();

    bookingsService = moduleRef.get(BookingsService);
    bookingsController = moduleRef.get(BookingsController);
  });

  describe('addBooking', () => {
    const booking: CreateBookingDto = {
      showtimeId: 1,
      seatNumber: 5,
      userId: "84438967-f68f-4fa0-b620-0f08217e76af",
    };
    
    it('should return a bookingId', async () => {
      const mockBookingResponse = { bookingId: "d1a6423b-4469-4b00-8c5f-e3cfc42eacae" };

      // mock 'addBooking' method of bookingsService
      jest.spyOn(bookingsService, 'addBooking').mockResolvedValue(mockBookingResponse);
  
      const result = await bookingsController.addBooking(booking);
  
      expect(result).toEqual(mockBookingResponse);
    });  
  });
});