import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '../users/user.doc'
import { UsersService } from '../users/users.service'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler())
    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user
    if (!user?.id) {
      return false
    }

    const dbUser = await this.usersService.getUserByAuth0Id(user.id)
    if (!dbUser) {
      return false
    }

    return requiredRoles.includes(dbUser.role)
  }
}
