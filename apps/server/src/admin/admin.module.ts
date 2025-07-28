import { Module } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'
import { ResultsModule } from '../results/results.module'
import { QuestionsModule } from '../questions/questions.module'

@Module({
  imports: [ResultsModule, QuestionsModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
