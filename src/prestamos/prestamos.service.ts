import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookState, Prestamo } from './prestamo.entity';
import { Repository } from 'typeorm';
import { LibrosService } from '../libros/libros.service';
import { UsersService } from '../users/users.service';
import { CreatePrestamoDto } from './dto/createprestamo.dto';
import { Book } from '../libros/libro.entity';

@Injectable()
export class PrestamosService {
  constructor(
    @InjectRepository(Prestamo)
    private prestamosRepository: Repository<Prestamo>,
    private booksService: LibrosService,
    private usersService: UsersService,
  ) {}

  async createPrestamo(prestamo: CreatePrestamoDto) {
    //Revisar que haya stock. y que el user y libro existan
    const user = await this.usersService.getUser(prestamo.user_id);
    if (!user) {
      return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }
    const book = await this.booksService.getBook(prestamo.book_id);
    if (!book) {
      return new HttpException('El libro no existe', HttpStatus.NOT_FOUND);
    }

    if (book instanceof Book) {
      if (book.amount == 0) {
        return new HttpException(
          'El libro no tiene ejemplares disponibles',
          HttpStatus.FAILED_DEPENDENCY,
        );
      } else {
        const newBook = { ...book, amount: book.amount - 1 };
        this.booksService.updateBook(newBook);
        //Si pasa todo esto descontar en uno y crear el prestamo
        const newPrestamo = this.prestamosRepository.create(prestamo);
        return this.prestamosRepository.save(newPrestamo);
      }
    }
  }

  //prestamo id
  async getPrestamo(id: number) {
    const prestamoFound = await this.prestamosRepository.findOne({
      where: { id: id },
    });

    if (!prestamoFound) {
      return new HttpException('Prestamo no encontrado', HttpStatus.NOT_FOUND);
    }
    return prestamoFound;
  }

  //prestamos deun usuario
  async getPrestamosDeUsuario(user_id: number) {
    const userFound = await this.usersService.getUser(user_id);
    if (!userFound) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    const prestamosDelUsuario = this.prestamosRepository.find({
      where: { user_id: user_id },
    });

    return prestamosDelUsuario;
  }
  //prestamos de un libro

  async getPrestamosDeLibro(book_id: number) {
    const bookFound = await this.booksService.getBook(book_id);
    if (!bookFound) {
      return new HttpException('Libro no encontrado', HttpStatus.NOT_FOUND);
    }

    const prestamosDelLibro = this.prestamosRepository.find({
      where: { book_id: book_id },
    });

    return prestamosDelLibro;
  }

  //falta la rut ad edevolverLibr
  async returnLibro(id: number) {
    const prestamo = await this.getPrestamo(id);

    if (!prestamo) {
      return new HttpException('Prestamo no encontrado', HttpStatus.NOT_FOUND);
    }

    if (prestamo instanceof Prestamo) {
      const book = await this.booksService.getBook(prestamo.book_id);
      if (book instanceof Book) {
        //Actualizar el ammount del libro
        const newBook = { ...book, amount: book.amount + 1 };
        this.booksService.updateBook(newBook);
      }
    }
    const updatedPrestamo = { ...prestamo, state: BookState.IN_STOCK };
    const result = Object.assign(prestamo, updatedPrestamo);
    return this.prestamosRepository.save(result);
  }
}
