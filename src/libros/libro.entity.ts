import { Author } from 'src/authors/author.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity( { name: 'book' })
export class Book {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    ISBN: string

    @Column()
    amount: number

    @Column()
    author_id: number

    @OneToOne(() => Author)
    @JoinColumn()
    author: Author
}