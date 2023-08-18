import { Test, TestingModule } from '@nestjs/testing';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';
import { Book } from './libro.entity';
import { CreateBookDto } from './dto/createBook.dto';

describe('LibrosController', () => {
  let librosController: LibrosController;
  const mockLibrosService = {
    getBooks: jest.fn().mockReturnValue([
      { id: 1, name: 'Book 1', description: 'Description 1', ISBN: '12345', amount: 2, author_id: 1 },
      { id: 2, name: 'Book 2', description: 'Description 2', ISBN: '67890', amount: 5, author_id: 2 },
    ]),
    getBook: jest.fn().mockImplementation((id) => ({
      id,
      name: `Book ${id}`,
      description: `Description ${id}`,
      ISBN: '12345',
      amount: 1,
      author_id: 1,
    })),
    createBook: jest.fn().mockImplementation((book) => ({
      id: Date.now(),
      ...book,
    })),
    deleteBook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibrosController],
      providers: [LibrosService],
    })
      .overrideProvider(LibrosService)
      .useValue(mockLibrosService)
      .compile();

    librosController = module.get<LibrosController>(LibrosController);
  });

  it('should be defined', () => {
    expect(librosController).toBeDefined();
  });

  it('should return an array of books', () => {
    const result = librosController.getBooks();

    expect(result).toEqual([
      { id: 1, name: 'Book 1', description: 'Description 1', ISBN: '12345', amount: 2, author_id: 1 },
      { id: 2, name: 'Book 2', description: 'Description 2', ISBN: '67890', amount: 5, author_id: 2 },
    ]);
  });

  it('should return a book by ID', () => {
    const bookId = 1;
    const result = librosController.getBook(bookId);

    expect(result).toEqual({
      id: bookId,
      name: `Book ${bookId}`,
      description: `Description ${bookId}`,
      ISBN: '12345',
      amount: 1,
      author_id: 1,
    });
  });

  it('should create a book', () => {
    const newBook: CreateBookDto = {
      name: 'New Book',
      description: 'New Description',
      ISBN: '55555',
      amount: 3,
      author_id: 1,
    };

    const createdBook = {
      id: expect.any(Number),
      ...newBook,
    };

    expect(librosController.createBook(newBook)).toEqual(createdBook);
  });

  it('should delete a book by ID', () => {
    const bookId = 1;
    librosController.deleteBook(bookId);

    expect(mockLibrosService.deleteBook).toHaveBeenCalledWith(bookId);
  });
});
