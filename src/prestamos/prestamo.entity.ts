import { Book } from 'src/libros/libro.entity';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'prestamo' })
export class Prestamo {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date

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

