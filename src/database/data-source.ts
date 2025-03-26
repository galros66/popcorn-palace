import { Booking } from '../bookings/booking.entity';
import { Movie } from '../movies/movie.entity';
import { Showtime } from '../showtimes/showtime.entity';
import { DataSource } from 'typeorm';

// this function also used in the tests
export const createNewDataSource = () => {
    return new DataSource({
        type: 'postgres',
        host: 'localhost', 
        port: 5432,
        username: 'popcorn-palace',
        password: 'popcorn-palace',
        database: 'popcorn-palace', 
        entities: [Movie, Showtime, Booking],
        synchronize: true,
        dropSchema: true,
    });
};

export const dataSource = createNewDataSource();