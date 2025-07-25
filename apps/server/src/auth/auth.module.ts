import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { JwtStrategy } from './jwt.strategy'
import { RolesGuard } from './roles.guard'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), ConfigModule, UsersModule],
  providers: [JwtStrategy, RolesGuard],
  exports: [PassportModule],
})
export class AuthModule {}
