import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('author')
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;
}
