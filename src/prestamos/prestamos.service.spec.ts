import { Test, TestingModule } from '@nestjs/testing';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/createprestamo.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Prestamo } from '../prestamos/prestamo.entity';
import { LibrosService } from '../libros/libros.service';
import { UsersService } from '../users/users.service';
import { Book } from '../libros/libro.entity';
import { User } from '../users/user.entity';

describe('PrestamosService', () => {
  let prestamosService: PrestamosService;
  let prestamosRepository: Repository<Prestamo>;
  let librosService: LibrosService;
  let usersService: UsersService;

  const mockLibrosService = {
    getBook: jest.fn().mockImplementation((id) => {
      if (id === 1) {
        return new Book();
      }
      return null;
    }),
    updateBook: jest.fn(),
  };

  const mockUsersService = {
    getUser: jest.fn().mockImplementation((id) => {
      if (id === 1) {
        return { id: 1 };
      }
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrestamosService,
        {
          provide: getRepositoryToken(Prestamo),
          useClass: Repository,
        },
        {
          provide: LibrosService,
          useValue: mockLibrosService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    prestamosService = module.get<PrestamosService>(PrestamosService);
    prestamosRepository = module.get<Repository<Prestamo>>(
      getRepositoryToken(Prestamo),
    );
    librosService = module.get<LibrosService>(LibrosService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(prestamosService).toBeDefined();
  });

  describe('createPrestamo', () => {
    it('should create a new prestamo', async () => {
      const createPrestamoDto: CreatePrestamoDto = {
        user_id: 1,
        book_id: 1,
      };
  
      const newUser = { id: 1, username: "ricardo", password: '123' };
      const newBook = new Book();
      newBook.amount = 1;
  
      const newPrestamo = new Prestamo(); // Crea una instancia de la entidad Prestamo
      jest.spyOn(usersService, 'getUser').mockResolvedValue(newUser);
      jest.spyOn(librosService, 'getBook').mockResolvedValue(newBook);
      jest.spyOn(prestamosRepository, 'create').mockReturnValue(newPrestamo);
      jest.spyOn(prestamosRepository, 'save').mockResolvedValue(newPrestamo); // Puedes ajustar el valor de retorno según tu entidad
  
      const result = await prestamosService.createPrestamo(createPrestamoDto);
  
      expect(result).toEqual(newPrestamo);
      expect(librosService.updateBook).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 0,
        }),
      );
    });
  });
  

  describe('getPrestamo', () => {
    it('should get a prestamo by ID', async () => {
      const prestamoId = 1;
      const prestamo = new Prestamo();
      jest
        .spyOn(prestamosRepository, 'findOne')
        .mockResolvedValueOnce(prestamo);

      const result = await prestamosService.getPrestamo(prestamoId);

      expect(result).toEqual(prestamo);
    });

    it('should throw an error if prestamo not found', async () => {
      const prestamoId = 1;
      jest.spyOn(prestamosRepository, 'findOne').mockResolvedValueOnce(null);

      try {
        await prestamosService.getPrestamo(prestamoId);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('Prestamo no encontrado', HttpStatus.NOT_FOUND),
        );
      }
    });
  });

  describe('getPrestamosDeUsuario', () => {
    it('should get prestamos of a user', async () => {
      const userId = 1;
      const user = { id: userId, username: 'messi', password: 'lionel' };
      const prestamos = [new Prestamo(), new Prestamo()];
      jest.spyOn(usersService, 'getUser').mockResolvedValue(user);
      jest.spyOn(prestamosRepository, 'find').mockResolvedValueOnce(prestamos);

      const result = await prestamosService.getPrestamosDeUsuario(userId);

      expect(result).toEqual(prestamos);
    });

    it('should throw an error if user not found', async () => {
      const userId = 1;
      jest.spyOn(usersService, 'getUser').mockResolvedValueOnce(null);

      try {
        await prestamosService.getPrestamosDeUsuario(userId);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND),
        );
      }
    });
  });
});
