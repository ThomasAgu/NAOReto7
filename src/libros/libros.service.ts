import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './libro.entity';
import { CreateBookDto } from './dto/createBook.dto';
import { AuthorsService } from 'src/authors/authors.service';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    private authorsService: AuthorsService,
  ) {}

  async createBook(book: CreateBookDto) {
    const bookFound = await this.bookRepository.findOne({
      where: {
        ISBN: book.ISBN,
      },
    });

    if (bookFound) {
      return new HttpException('Libro ya existente', HttpStatus.NOT_FOUND);
    }

    //fijarse que el author exista
    const authorFound = await this.authorsService.getAuthor(book.author_id);
    if (!authorFound) {
      return new HttpException('El author no existe', HttpStatus.NOT_FOUND);
    }

    const newBook = this.bookRepository.create(book);
    return this.bookRepository.save(newBook);
  }

  getBooks() {
    return this.bookRepository.find();
  }

  async getBook(id: number) {
    const bookFound = await this.bookRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!bookFound) {
      return new HttpException('Libro no encontrado', HttpStatus.NOT_FOUND);
    }

    return bookFound;
  }

  async deleteBook(id: number) {
    const result = await this.bookRepository.delete({ id });

    if (result.affected === 0) {
      return new HttpException('Libro no existente', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
