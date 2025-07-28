import { IUser } from '@tac-med/shared-types'
import { Expose, Transform } from 'class-transformer'
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'
import { UserRole } from './user.doc'

export class UserDto implements IUser {
  @Expose()
  @Transform(({ obj }) => obj._id.toString(), { toClassOnly: true })
  id!: string

  @Expose()
  email!: string

  @Expose()
  name!: string

  @Expose()
  role!: UserRole

  @Expose()
  createdAt!: Date

  @Expose()
  updatedAt!: Date
}

export class CreateUserDto {
  @IsString()
  name!: string

  @IsEmail()
  email!: string

  @IsString()
  @IsOptional()
  auth0Id?: string

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole
}
