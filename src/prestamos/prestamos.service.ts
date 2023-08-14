import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prestamo } from './prestamo.entity';
import { Repository } from 'typeorm';
import { LibrosService } from 'src/libros/libros.service';
import { UsersService } from 'src/users/users.service';
import { CreatePrestamoDto } from './dto/createprestamo.dto';

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

    if (book[0].amount == 0) {
      return new HttpException(
        'El libro no tiene ejemplares disponibles',
        HttpStatus.FAILED_DEPENDENCY,
      );
    }

    //Si pasa todo esto descontar en uno y crear el prestamo
    const newPrestamo = this.prestamosRepository.create(prestamo);
    return this.prestamosRepository.save(newPrestamo);
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
}
