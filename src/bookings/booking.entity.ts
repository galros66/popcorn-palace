import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() 
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    bookingId: string;

    @Column()
    showtimeId: number

    @Column('uuid')
    userId: string;
  
    @Column()
    seatNumber: number;
}