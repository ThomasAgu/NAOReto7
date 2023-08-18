import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  const mockUsersService = {
    createUser: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),

    updateUser: jest.fn().mockImplementation((id, user) => ({
      id,
      ...user,
    })),

    getUser: jest.fn().mockImplementation((id) => ({
      id,
    })),

    getUsers: jest.fn().mockReturnValue([
      { id: 1, username: 'user1', password: '123' },
      { id: 2, username: 'user2', password: '321' },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  //Aca van los tests
  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should create a user', () => {
    expect(
      usersController.createUser({ username: 'Jorge', password: '123' }),
    ).toEqual({
      id: expect.any(Number),
      username: 'Jorge',
      password: '123',
    });
  });

  it('should update an user', () => {
    const user = { username: 'Alberto' };

    expect(usersController.updateUser(1, user)).toEqual({
      id: 1,
      ...user,
    });
  });

  it('should return an user', () => {
    const user = { id: 1 };
    expect(usersController.getUser(1)).toEqual({
      id: user.id,
      ...user,
    });
  });

  it('should return an array of users', () => {
    const result = usersController.getUsers();

    expect(result).toEqual([
      { id: 1, username: 'user1', password: '123' },
      { id: 2, username: 'user2', password: '321' },
    ]);
  });
});
