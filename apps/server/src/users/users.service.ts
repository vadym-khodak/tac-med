import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDoc, UserInDb, UserRole } from './user.doc'
import { CreateUserDto, UpdateUserDto } from './user.dto'

interface Auth0User {
  id: string
  email: string
  name?: string
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserInDb.name) private userModel: Model<UserDoc>) {}

  async getUsers(): Promise<UserDoc[]> {
    return this.userModel.find().exec()
  }

  async getUser(id: string): Promise<UserDoc> {
    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async getUserByEmail(email: string): Promise<UserDoc | null> {
    return this.userModel.findOne({ email }).exec()
  }

  async getUserByAuth0Id(auth0Id: string): Promise<UserDoc | null> {
    return this.userModel.findOne({ auth0Id }).exec()
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDoc> {
    const newUser = new this.userModel(createUserDto)
    return newUser.save()
  }

  async findOrCreateUser(auth0User: Auth0User): Promise<UserDoc> {
    let user = await this.getUserByAuth0Id(auth0User.id)

    if (!user) {
      // Check if user exists with this email
      user = await this.getUserByEmail(auth0User.email)

      if (user) {
        // Update existing user with Auth0 ID
        user.auth0Id = auth0User.id
        return user.save()
      }

      // Create new user
      const createUserDto: CreateUserDto = {
        email: auth0User.email,
        name: auth0User.name || auth0User.email.split('@')[0],
        auth0Id: auth0User.id,
        role: UserRole.MEMBER,
      }
      user = await this.createUser(createUserDto)
    }

    return user
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDoc> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec()
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec()
    return !!result
  }
}
