import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { QuestionsModule } from '../questions/questions.module'
import { Result, ResultSchema } from './result.schema'
import { ResultsController } from './results.controller'
import { ResultsService } from './results.service'

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
