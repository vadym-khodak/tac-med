import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { UserDoc, UserRole } from './user.doc'
import { CreateUserDto, UpdateUserDto, UserDto } from './user.dto'
import { UsersService } from './users.service'

const mapUserToDto = (user: UserDoc): UserDto => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async list(): Promise<UserDto[]> {
    const users = await this.usersService.getUsers()
    return users.filter(Boolean).map(mapUserToDto)
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async get(@Param('id') id: string): Promise<UserDto> {
    const user = await this.usersService.getUser(id)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return mapUserToDto(user)
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.usersService.createUser(createUserDto)
    if (!user) {
      throw new NotFoundException('Failed to create user')
    }
    return mapUserToDto(user)
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.usersService.updateUser(id, updateUserDto)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return mapUserToDto(user)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string): Promise<boolean> {
    const result = await this.usersService.deleteUser(id)
    if (!result) {
      throw new NotFoundException('User not found')
    }
    return result
  }
}
