import { Test, TestingModule } from '@nestjs/testing';
import { PrestamosController } from './prestamos.controller';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/createprestamo.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('PrestamosController', () => {
  let prestamosController: PrestamosController;
  const mockPrestamosService = {
    createPrestamo: jest.fn().mockImplementation((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    returnLibro: jest.fn().mockResolvedValue(null),
    getPrestamo: jest.fn().mockResolvedValue({ id: 1, user_id: 1, book_id: 1 }),
    getPrestamosDeUsuario: jest.fn().mockResolvedValue([
      { id: 1, user_id: 1, book_id: 1 },
      { id: 2, user_id: 1, book_id: 2 },
    ]),
    getPrestamosDeLibro: jest.fn().mockResolvedValue([
      { id: 1, user_id: 1, book_id: 1 },
      { id: 2, user_id: 2, book_id: 1 },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestamosController],
      providers: [PrestamosService],
    })
      .overrideProvider(PrestamosService)
      .useValue(mockPrestamosService)
      .compile();

    prestamosController = module.get<PrestamosController>(PrestamosController);
  });

  it('should be defined', () => {
    expect(prestamosController).toBeDefined();
  });

  it('should create a prestamo', () => {
    const createPrestamoDto: CreatePrestamoDto = {
      user_id: 1,
      book_id: 1,
    };

    expect(prestamosController.createPrestamo(createPrestamoDto)).toEqual({
      id: expect.any(Number),
      ...createPrestamoDto,
    });
  });

  it('should devolverPrestamo', async () => {
    const prestamoId = 1;

    await prestamosController.devolverPrestamo(prestamoId);

    expect(mockPrestamosService.returnLibro).toHaveBeenCalledWith(prestamoId);
  });

  it('should return a prestamo', async () => {
    const prestamoId = 1;
    const result = await prestamosController.getPrestamo(prestamoId);

    expect(result).toEqual({ id: 1, user_id: 1, book_id: 1 });
  });

  it('should return an array of prestamos for a given user', async () => {
    const userId = 1;
    const result = await prestamosController.getPrestamosDeUsuario(userId);

    expect(result).toEqual([
      { id: 1, user_id: 1, book_id: 1 },
      { id: 2, user_id: 1, book_id: 2 },
    ]);
  });

  it('should return an array of prestamos for a given book', async () => {
    const bookId = 1;
    const result = await prestamosController.getPrestamosDeLibro(bookId);

    expect(result).toEqual([
      { id: 1, user_id: 1, book_id: 1 },
      { id: 2, user_id: 2, book_id: 1 },
    ]);
  });
});
