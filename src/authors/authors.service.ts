import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dto/createAuthor.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author) private authorRepository: Repository<Author>,
  ) {}

  //get y post y get by id
  async createAuthor(author: CreateAuthorDto) {
    const authorExist = await this.authorRepository.findOne({
      where: {
        name: author.name,
      },
    });

    if (authorExist) {
      return new HttpException('El autor ya existe', HttpStatus.CONFLICT);
    }

    const newAuthor = this.authorRepository.create(author);
    return this.authorRepository.save(newAuthor);
  }

  getAuthors() {
    return this.authorRepository.find();
  }

  async getAuthor(id: number) {
    const authorFound = await this.authorRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!authorFound) {
      return new HttpException('Author no encontrado', HttpStatus.CONFLICT);
    }

    return authorFound;
  }
}
