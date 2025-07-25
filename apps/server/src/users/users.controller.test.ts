import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { UserDoc, UserRole } from './user.doc'
import { CreateUserDto, UpdateUserDto, UserDto } from './user.dto'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

// Mock the entire utils module
jest.mock('../utils', () => ({
  documentToDto: jest.fn((doc, _cls) => {
    if (!doc) return undefined
    return {
      id: 'test-id',
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.MEMBER,
      createdAt: new Date('2025-04-13T16:04:56.546Z'),
      updatedAt: new Date('2025-04-13T16:04:56.546Z'),
    }
  }),
}))

describe('UsersController', () => {
  let controller: UsersController
  let service: UsersService

  const mockUsersService = {
    getUsers: jest.fn(),
    getUser: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  }

  const mockUserDoc = {
    _id: 'test-id',
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.MEMBER,
    auth0Id: 'auth0|123',
    createdAt: new Date('2025-04-13T16:04:56.546Z'),
    updatedAt: new Date('2025-04-13T16:04:56.546Z'),
    toJSON: jest.fn().mockReturnValue({
      _id: 'test-id',
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.MEMBER,
      auth0Id: 'auth0|123',
      createdAt: new Date('2025-04-13T16:04:56.546Z'),
      updatedAt: new Date('2025-04-13T16:04:56.546Z'),
    }),
  } as unknown as UserDoc

  const mockUserDto: UserDto = {
    id: 'test-id',
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.MEMBER,
    createdAt: new Date('2025-04-13T16:04:56.546Z'),
    updatedAt: new Date('2025-04-13T16:04:56.546Z'),
  }

  beforeEach(async () => {
    // Reset mock implementations before each test
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('list', () => {
    it('should return an array of users', async () => {
      mockUsersService.getUsers.mockResolvedValue([mockUserDoc])

      const result = await controller.list()

      expect(result).toEqual([mockUserDto])
      expect(service.getUsers).toHaveBeenCalled()
    })

    it('should filter out undefined users', async () => {
      mockUsersService.getUsers.mockResolvedValue([mockUserDoc, null])

      const result = await controller.list()

      expect(result).toEqual([mockUserDto])
      expect(service.getUsers).toHaveBeenCalled()
    })
  })

  describe('get', () => {
    it('should return a single user', async () => {
      mockUsersService.getUser.mockResolvedValue(mockUserDoc)

      const result = await controller.get('user-id-1')

      expect(result).toEqual(mockUserDto)
      expect(service.getUser).toHaveBeenCalledWith('user-id-1')
    })

    it('should throw NotFoundException when user is not found', async () => {
      mockUsersService.getUser.mockResolvedValue(null)

      await expect(controller.get('non-existent-id')).rejects.toThrow(NotFoundException)
      expect(service.getUser).toHaveBeenCalledWith('non-existent-id')
    })
  })

  describe('create', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      }

      mockUsersService.createUser.mockResolvedValue(mockUserDoc)

      const result = await controller.create(createUserDto)

      expect(result).toEqual(mockUserDto)
      expect(service.createUser).toHaveBeenCalledWith(createUserDto)
    })

    it('should throw NotFoundException when created user is not found', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      }

      mockUsersService.createUser.mockResolvedValue(null)

      await expect(controller.create(createUserDto)).rejects.toThrow(NotFoundException)
      expect(service.createUser).toHaveBeenCalledWith(createUserDto)
    })
  })

  describe('update', () => {
    it('should update and return a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
      }

      mockUsersService.updateUser.mockResolvedValue(mockUserDoc)

      const result = await controller.update('user-id-1', updateUserDto)

      expect(result).toEqual(mockUserDto)
      expect(service.updateUser).toHaveBeenCalledWith('user-id-1', updateUserDto)
    })

    it('should throw NotFoundException when updated user is not found', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
      }

      mockUsersService.updateUser.mockResolvedValue(null)

      await expect(controller.update('non-existent-id', updateUserDto)).rejects.toThrow(
        NotFoundException,
      )
      expect(service.updateUser).toHaveBeenCalledWith('non-existent-id', updateUserDto)
    })
  })

  describe('delete', () => {
    it('should delete a user and return true', async () => {
      mockUsersService.deleteUser.mockResolvedValue(true)

      const result = await controller.delete('user-id-1')

      expect(result).toBe(true)
      expect(service.deleteUser).toHaveBeenCalledWith('user-id-1')
    })

    it('should throw NotFoundException when user to delete is not found', async () => {
      mockUsersService.deleteUser.mockResolvedValue(false)

      await expect(controller.delete('non-existent-id')).rejects.toThrow(NotFoundException)
      expect(service.deleteUser).toHaveBeenCalledWith('non-existent-id')
    })
  })
})
