import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() 
export class Showtime {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column('decimal', { transformer: {
        to: (value: number) => value,
        from: (value: string | number) => parseFloat(value.toString())
    }}) // without the trasformer sometime the price saved as string.
    price: number;
  
    @Column()
    movieId: number;
  
    @Column()
    theater: string;
  
    @Column()
    startTime: string;
  
    @Column()
    endTime: string;
}