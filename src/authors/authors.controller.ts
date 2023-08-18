import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dto/createAuthor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Get()
  getAuthors(): Promise<Author[]> {
    return this.authorsService.getAuthors();
  }

  @Get(':id')
  getAuthor(@Param('id', ParseIntPipe) id: number) {
    return this.authorsService.getAuthor(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  createAuthor(@Body() newAuthor: CreateAuthorDto) {
    return this.authorsService.createAuthor(newAuthor);
  }
}
