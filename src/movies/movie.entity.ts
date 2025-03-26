import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() 
export class Movie {
  @PrimaryGeneratedColumn({type: 'int'}) 
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column({type: 'int'})
  duration: number;

  @Column({type: 'float'})
  rating: number;

  @Column({type: 'int'})
  releaseYear: number;
}
