import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type UserDoc = UserInDb & Document

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export const USERS_COLLECTION = 'users'

@Schema({ collection: USERS_COLLECTION, timestamps: true })
export class UserInDb {
  _id!: Types.ObjectId

  @Prop({ required: true })
  name!: string

  @Prop({ required: true, unique: true })
  email!: string

  @Prop({ required: true, enum: UserRole, default: UserRole.MEMBER })
  role!: UserRole

  @Prop()
  auth0Id!: string

  // Timestamps are added automatically by mongoose
  createdAt!: Date
  updatedAt!: Date
}

export const UserSchema = SchemaFactory.createForClass(UserInDb)
