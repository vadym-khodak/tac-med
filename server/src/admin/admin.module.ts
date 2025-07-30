import { Module } from '@nestjs/common'
import { QuestionsModule } from '../questions/questions.module'
import { ResultsModule } from '../results/results.module'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'

@Module({
  imports: [ResultsModule, QuestionsModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
