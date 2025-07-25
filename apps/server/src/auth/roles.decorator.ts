import { SetMetadata } from '@nestjs/common'
import { UserRole } from '../users/user.doc'

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles)
