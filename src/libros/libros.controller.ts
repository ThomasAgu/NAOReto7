import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { LibrosService } from './libros.service';
import { Book } from './libro.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  createBook(@Body() newBook: CreateBookDto) {
    return this.librosService.createBook(newBook);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.deleteBook(id);
  }
}
