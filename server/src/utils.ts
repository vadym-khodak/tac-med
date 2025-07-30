import { ClassConstructor, plainToClass } from 'class-transformer'
import { Document } from 'mongoose'
export function documentToDto<T>(doc: Document, cls: ClassConstructor<T>): T | undefined {
  if (typeof doc === 'undefined' || doc === null) {
    return undefined
  }
  // stringify-parse combo to remove all non-JSON types .toJSON returns
  const plainDocument = JSON.parse(JSON.stringify(doc.toJSON()))
  return plainToClass(cls, plainDocument, {
    excludeExtraneousValues: true,
  })
}
