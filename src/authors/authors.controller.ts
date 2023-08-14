import { Controller, Post, Body, Get, Delete, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dto/createAuthor.dto';

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

  @Post()
  createAuthor(@Body() newAuthor: CreateAuthorDto) {
    return this.authorsService.createAuthor(newAuthor);
  }
}
