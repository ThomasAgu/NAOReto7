import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dto/createAuthor.dto';

describe('AuthorsController', () => {
  let authorsController: AuthorsController;
  
  const mockAuthorsService = {
    getAuthors: jest.fn().mockReturnValue([
      { id: 1, name: 'John', surname: 'Doe' },
      { id: 2, name: 'Jane', surname: 'Smith' },
    ]),
    getAuthor: jest.fn().mockImplementation((id) => ({
      id,
    })),
    createAuthor: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [AuthorsService],
    })
      .overrideProvider(AuthorsService)
      .useValue(mockAuthorsService)
      .compile();

    authorsController = module.get<AuthorsController>(AuthorsController);
  });

  describe('getAuthors', () => {
    it('should return an array of authors', async () => {
      const result = authorsController.getAuthors();

      expect(result).toEqual([
        { id: 1, name: 'John', surname: 'Doe' },
        { id: 2, name: 'Jane', surname: 'Smith' },
      ]);
    });
  });

  describe('getAuthor', () => {
    it('should return an author by ID', async () => {
      const author = { id: 1};
      expect(authorsController.getAuthor(1)).toEqual({
        id: author.id,
        ...author,
      });
    });
  });

  describe('createAuthor', () => {
    it('should create a new author', async () => {
      expect(
        authorsController.createAuthor({ name: "Juan", surname:"Borges"}),
      ).toEqual({
        id: expect.any(Number),
        name: "Juan",
        surname: "Borges"
      });
    });
  });
});
