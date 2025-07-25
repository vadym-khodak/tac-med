import { NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Document, Model, Query, Schema, Types } from 'mongoose'
import { UserDoc, UserInDb, UserRole } from './user.doc'
import { UsersService } from './users.service'

type MockMongooseQuery<T> = Partial<Query<T, Document>> & { exec: jest.Mock }
type MockDocument = Document<unknown, Schema<UserDoc>, UserDoc> & UserInDb & { __v: number }

describe('UsersService', () => {
  let service: UsersService
  let mockUserModel: Model<UserDoc>

  const mockUserDoc: MockDocument = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.MEMBER,
    auth0Id: 'auth0|123',
    createdAt: new Date('2025-04-13T16:04:56.546Z'),
    updatedAt: new Date('2025-04-13T16:04:56.546Z'),
    __v: 0,
    save: jest.fn().mockResolvedValue(this),
  } as unknown as MockDocument

  beforeEach(async () => {
    const mockModel = {
      find: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockReturnThis(),
      findById: jest.fn().mockReturnThis(),
      findByIdAndUpdate: jest.fn().mockReturnThis(),
      findByIdAndDelete: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    }

    // Add constructor behavior
    const model = function (this: any, data: any) {
      return {
        ...mockUserDoc,
        ...data,
        save: jest.fn().mockResolvedValue({ ...mockUserDoc, ...data }),
      }
    } as any

    Object.assign(model, mockModel)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(UserInDb.name),
          useValue: model,
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    mockUserModel = module.get<Model<UserDoc>>(getModelToken(UserInDb.name))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockQuery: MockMongooseQuery<UserDoc[]> = {
        exec: jest.fn().mockResolvedValue([mockUserDoc]),
      }
      jest
        .spyOn(mockUserModel, 'find')
        .mockReturnValue(mockQuery as unknown as Query<UserDoc[], UserDoc>)

      const result = await service.getUsers()
      expect(result).toEqual([mockUserDoc])
      expect(mockUserModel.find).toHaveBeenCalled()
    })
  })

  describe('getUser', () => {
    it('should return a single user', async () => {
      const mockQuery: MockMongooseQuery<UserDoc | null> = {
        exec: jest.fn().mockResolvedValue(mockUserDoc),
      }
      jest
        .spyOn(mockUserModel, 'findById')
        .mockReturnValue(mockQuery as unknown as Query<UserDoc | null, UserDoc>)

      const result = await service.getUser('test-id')
      expect(result).toEqual(mockUserDoc)
      expect(mockUserModel.findById).toHaveBeenCalledWith('test-id')
    })

    it('should throw NotFoundException when user is not found', async () => {
      const mockQuery: MockMongooseQuery<UserDoc | null> = {
        exec: jest.fn().mockResolvedValue(null),
      }
      jest
        .spyOn(mockUserModel, 'findById')
        .mockReturnValue(mockQuery as unknown as Query<UserDoc | null, UserDoc>)

      await expect(service.getUser('non-existent-id')).rejects.toThrow(NotFoundException)
      expect(mockUserModel.findById).toHaveBeenCalledWith('non-existent-id')
    })
  })

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const mockQuery: MockMongooseQuery<UserDoc | null> = {
        exec: jest.fn().mockResolvedValue(mockUserDoc),
      }
      jest
        .spyOn(mockUserModel, 'findOne')
        .mockReturnValue(mockQuery as unknown as Query<UserDoc | null, UserDoc>)

      const result = await service.getUserByEmail('test@example.com')
      expect(result).toEqual(mockUserDoc)
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
    })
  })

  describe('getUserByAuth0Id', () => {
    it('should return a user by Auth0 ID', async () => {
      const mockQuery: MockMongooseQuery<UserDoc | null> = {
        exec: jest.fn().mockResolvedValue(mockUserDoc),
      }
      jest
        .spyOn(mockUserModel, 'findOne')
        .mockReturnValue(mockQuery as unknown as Query<UserDoc | null, UserDoc>)

      const result = await service.getUserByAuth0Id('auth0|123')
      expect(result).toEqual(mockUserDoc)
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ auth0Id: 'auth0|123' })
    })
  })

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        auth0Id: 'auth0|123',
        role: UserRole.MEMBER,
      }

      const result = await service.createUser(createUserDto)
      expect(result).toEqual({ ...mockUserDoc, ...createUserDto })
    })
  })

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      const updateUserDto = { name: 'Updated Name' }
      const mockQuery: MockMongooseQuery<UserDoc | null> = {
        exec: jest.fn().mockResolvedValue(mockUserDoc),
      }
      jest
        .spyOn(mockUserModel, 'findByIdAndUpdate')
        .mockReturnValue(mockQuery as unknown as Query<UserDoc | null, UserDoc>)

      const result = await service.updateUser('test-id', updateUserDto)
      expect(result).toEqual(mockUserDoc)
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('test-id', updateUserDto, {
        new: true,
      })
    })

    it('should throw NotFoundException when user to update is not found', async () => {
      const mockQuery: MockMongooseQuery<UserDoc | null> = {
        exec: jest.fn().mockResolvedValue(null),
      }
      jest
        .spyOn(mockUserModel, 'findByIdAndUpdate')
        .mockReturnValue(mockQuery as unknown as Query<UserDoc | null, UserDoc>)

      await expect(service.updateUser('non-existent-id', { name: 'New Name' })).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('deleteUser', () => {
    it('should delete a user and return true when successful', async () => {
      const mockQuery: MockMongooseQuery<UserDoc | null> = {
        exec: jest.fn().mockResolvedValue(mockUserDoc),
      }
      jest
        .spyOn(mockUserModel, 'findByIdAndDelete')
        .mockReturnValue(mockQuery as unknown as Query<UserDoc | null, UserDoc>)

      const result = await service.deleteUser('test-id')
      expect(result).toBe(true)
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('test-id')
    })

    it('should return false when no user was deleted', async () => {
      const mockQuery: MockMongooseQuery<UserDoc | null> = {
        exec: jest.fn().mockResolvedValue(null),
      }
      jest
        .spyOn(mockUserModel, 'findByIdAndDelete')
        .mockReturnValue(mockQuery as unknown as Query<UserDoc | null, UserDoc>)

      const result = await service.deleteUser('non-existent-id')
      expect(result).toBe(false)
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('non-existent-id')
    })
  })
})
