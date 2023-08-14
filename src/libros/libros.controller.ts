import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { LibrosService } from './libros.service';
import { Book } from './libro.entity';

@Controller('libros')
export class LibrosController {
  constructor(private librosService: LibrosService) {}

  @Get()
  getBooks(): Promise<Book[]> {
    return this.librosService.getBooks();
  }

  @Get(':id')
  getBook(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.getBook(id);
  }

  @Post()
  createBook(@Body() newBook: CreateBookDto) {
    return this.librosService.createBook(newBook);
  }

  @Delete()
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.deleteBook(id);
  }
}
