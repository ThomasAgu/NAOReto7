import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'password123',
        age: 25,
      };

      const newUser = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'create').mockReturnValue(newUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(newUser);

      const result = await usersService.createUser(createUserDto);

      expect(result).toEqual(newUser);
    });
  });

  describe('getUser', () => {
    it('should get a user by ID', async () => {
      const userId = 1;
      const user = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      const result = await usersService.getUser(userId);
      expect(result).toEqual(user);
    });

    it('should throw an error if user not found', async () => {
      const userId = 1; // ID de usuario que no existe
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null); // Simulamos que el usuario no existe

      try {
        await usersService.getUser(userId);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND),
        );
      }
    });
  });

  describe('getUserByName', () => {
    it('should return a user by username', async () => {
      const username = 'existinguser';
      const existingUser = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);

      const result = await usersService.getUserByName(username);

      expect(result).toEqual(existingUser);
    });

    it('should throw an error if user not found', async () => {
      const username = 'nonexistentuser';
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      try {
        await usersService.getUserByName(username);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND),
        );
      }
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const userId = 1;
      const deleteResult: DeleteResult = { affected: 1, raw: {} };
      jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResult);

      const result = await usersService.deleteUser(userId);

      expect(result).toEqual(deleteResult);
    });

    it('should throw an error if user not found', async () => {
      const userId = 1;
      const deleteResult: DeleteResult = { affected: 0, raw: {} };
      jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResult);

      try {
        await usersService.deleteUser(userId);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND),
        );
      }
    });
  });

  describe('updateUser', () => {
    it('should update a user by ID', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        username: "rodrigo"
      };

      const existingUser = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(existingUser);
      const result = await usersService.updateUser(userId, updateUserDto);
      expect(result).toEqual(existingUser);
    });

    it('should throw an error if user not found', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        // ... update properties
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      try {
        await usersService.updateUser(userId, updateUserDto);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND),
        );
      }
    });
  });
});
