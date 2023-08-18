import { Test, TestingModule } from '@nestjs/testing';
import { LibrosService } from './libros.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Book } from './libro.entity';
import { CreateBookDto } from './dto/createBook.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthorsService } from '../authors/authors.service';
import { Author } from '../authors/author.entity';

describe('LibrosService', () => {
  let librosService: LibrosService;
  let bookRepository: Repository<Book>;
  let authorsService: AuthorsService;

  const mockAuthorsService = {
    getAuthor: jest.fn().mockImplementation((id) => ({
      id,
      name: 'AuthorName',
      surname: 'AuthorSurname',
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibrosService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
        {
          provide: AuthorsService,
          useValue: mockAuthorsService,
        },
      ],
    }).compile();

    librosService = module.get<LibrosService>(LibrosService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    authorsService = module.get<AuthorsService>(AuthorsService);
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        name: 'BookName',
        description: 'BookDescription',
        ISBN: '1234567890',
        amount: 5,
        author_id: 1,
      };

      const newBook = new Book();
      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(authorsService, 'getAuthor').mockResolvedValueOnce({
        id: createBookDto.author_id,
        name: 'AuthorName',
        surname: 'AuthorSurname',
      });
      jest.spyOn(bookRepository, 'create').mockReturnValue(newBook);
      jest.spyOn(bookRepository, 'save').mockResolvedValue(newBook);

      const result = await librosService.createBook(createBookDto);

      expect(result).toEqual(newBook);
    });

    it('should throw an error if book already exists', async () => {
      const createBookDto: CreateBookDto = {
        name: 'BookName',
        description: 'BookDescription',
        ISBN: '1234567890',
        amount: 5,
        author_id: 1,
      };
      const existingBook = new Book();

      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(existingBook);

      try {
        await librosService.createBook(createBookDto);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('Libro ya existente', HttpStatus.NOT_FOUND),
        );
      }
    });

    it('should throw an error if author does not exist', async () => {
      const createBookDto: CreateBookDto = {
        name: 'BookName',
        description: 'BookDescription',
        ISBN: '1234567890',
        amount: 5,
        author_id: 1,
      };

      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(authorsService, 'getAuthor').mockResolvedValueOnce(null);

      try {
        await librosService.createBook(createBookDto);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('El author no existe', HttpStatus.NOT_FOUND),
        );
      }
    });
  });

  // Rest of the tests for getBooks, getBook, deleteBook, and updateBook
});
