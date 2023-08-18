import { Book } from '../libros/libro.entity';
import { User } from '../users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

export enum BookState {
    OUT = 'out',
    IN_STOCK = 'in_stock',
  }
@Entity({ name: 'prestamo' })
export class Prestamo {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date

    @Column({ type: 'enum', enum: BookState, default: BookState.IN_STOCK})
    state: BookState

    @Column()
    user_id: number

    @Column()
    book_id: number
    
    @OneToOne(() => User)
    @JoinColumn()
    user: User

    @OneToOne(() => Book)
    @JoinColumn()
    book: Book
}

