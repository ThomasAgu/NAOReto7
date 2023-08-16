import {
  Controller,
  Post,
  Body,
  Patch,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/createprestamo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('prestamos')
export class PrestamosController {
  constructor(private prestamosService: PrestamosService) {}

  @Post()
  createPrestamo(@Body() newPrestamo: CreatePrestamoDto) {
    return this.prestamosService.createPrestamo(newPrestamo);
  }

  @Patch(':id')
  devolverPrestamo(@Param('id', ParseIntPipe) id: number) {
    return this.prestamosService.returnLibro(id);
  }

  @Get(':id')
  getPrestamo(@Param('id', ParseIntPipe) id: number) {
    return this.prestamosService.getPrestamo(id);
  }

  @Get(':user_id')
  getPrestamosDeUsuario(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.prestamosService.getPrestamosDeUsuario(user_id);
  }

  @Get(':book_id')
  getPrestamosDeLibro(@Param('book_id', ParseIntPipe) book_id: number) {
    return this.prestamosService.getPrestamosDeLibro(book_id);
  }
}
