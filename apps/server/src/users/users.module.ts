import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserInDb, UserSchema } from './user.doc'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: UserInDb.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
