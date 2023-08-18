import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dto/createAuthor.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthorsService', () => {
  let authorsService: AuthorsService;
  let authorRepository: Repository<Author>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
          useClass: Repository,
        },
      ],
    }).compile();

    authorsService = module.get<AuthorsService>(AuthorsService);
    authorRepository = module.get<Repository<Author>>(getRepositoryToken(Author));
  });

  describe('createAuthor', () => {
    it('should create a new author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'John',
        surname: 'Doe',
      };

      const newAuthor = new Author();
      jest.spyOn(authorRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(authorRepository, 'create').mockReturnValue(newAuthor);
      jest.spyOn(authorRepository, 'save').mockResolvedValue(newAuthor);

      const result = await authorsService.createAuthor(createAuthorDto);

      expect(result).toEqual(newAuthor);
    });

    it('should throw an error if author already exists', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'John',
        surname: 'Doe',
      };
      const existingAuthor = new Author();
      jest.spyOn(authorRepository, 'findOne').mockResolvedValueOnce(existingAuthor);

      try {
        await authorsService.createAuthor(createAuthorDto);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('El autor ya existe', HttpStatus.CONFLICT),
        );
      }
    });
  });

  describe('getAuthors', () => {
    it('should return an array of authors', async () => {
      const expectedResult: Author[] = [
        { id: 1, name: 'John', surname: 'Doe' },
        { id: 2, name: 'Jane', surname: 'Smith' },
      ];
      jest.spyOn(authorRepository, 'find').mockResolvedValue(expectedResult);

      const result = await authorsService.getAuthors();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAuthor', () => {
    it('should get an author by ID', async () => {
      const authorId = 1;
      const author = new Author();
      jest.spyOn(authorRepository, 'findOne').mockResolvedValueOnce(author);
      const result = await authorsService.getAuthor(authorId);
      expect(result).toEqual(author);
    });

    it('should throw an error if author not found', async () => {
      const authorId = 1; // ID de autor que no existe
      jest.spyOn(authorRepository, 'findOne').mockResolvedValueOnce(null); // Simulamos que el autor no existe

      try {
        await authorsService.getAuthor(authorId);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('Author no encontrado', HttpStatus.CONFLICT),
        );
      }
    });
  });

  // ... (otros métodos de prueba)
});
