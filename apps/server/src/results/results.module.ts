import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ResultsService } from './results.service'
import { ResultsController } from './results.controller'
import { Result, ResultSchema } from './result.schema'
import { QuestionsModule } from '../questions/questions.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
    QuestionsModule,
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}
