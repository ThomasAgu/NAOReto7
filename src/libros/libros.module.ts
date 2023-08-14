import { Module } from '@nestjs/common';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './libro.entity';
import { AuthorsModule } from 'src/authors/authors.module';
@Module({
  imports: [TypeOrmModule.forFeature([Book]), AuthorsModule],
  controllers: [LibrosController],
  providers: [LibrosService],
  exports: [LibrosService],
})
export class LibrosModule {}
