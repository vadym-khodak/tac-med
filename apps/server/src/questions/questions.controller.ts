import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CreateQuestionDto, ImportQuestionsDto } from './dto/create-question.dto'
import { QuestionsService } from './questions.service'

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto)
  }

  @Get()
  findAll() {
    return this.questionsService.findAll()
  }

  @Get('by-block/:block')
  findByBlock(@Param('block') block: string) {
    const blockNumber = Number.parseInt(block)
    if (Number.isNaN(blockNumber) || blockNumber < 1 || blockNumber > 6) {
      throw new BadRequestException('Block must be a number between 1 and 6')
    }
    return this.questionsService.findByBlock(blockNumber)
  }

  @Get('random')
  getRandomQuestions(@Query('block') block: string, @Query('count') count?: string) {
    const blockNumber = Number.parseInt(block)
    const questionCount = count ? Number.parseInt(count) : 10

    if (Number.isNaN(blockNumber) || blockNumber < 1 || blockNumber > 6) {
      throw new BadRequestException('Block must be a number between 1 and 6')
    }

    if (Number.isNaN(questionCount) || questionCount < 1) {
      throw new BadRequestException('Count must be a positive number')
    }

    return this.questionsService.getRandomQuestionsByBlock(blockNumber, questionCount)
  }

  @Get('test-set')
  async getTestSet() {
    const testQuestions = []

    for (let block = 1; block <= 6; block++) {
      const blockQuestions = await this.questionsService.getRandomQuestionsByBlock(block, 10)
      testQuestions.push(...blockQuestions)
    }

    return {
      questions: testQuestions,
      totalQuestions: testQuestions.length,
      blocksCount: 6,
      questionsPerBlock: 10,
    }
  }

  @Get('counts')
  getQuestionsCount() {
    return this.questionsService.getQuestionsCount()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: CreateQuestionDto) {
    return this.questionsService.update(id, updateQuestionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id)
  }

  @Post('import')
  importQuestions(@Body() importDto: ImportQuestionsDto) {
    return this.questionsService.importQuestions(importDto)
  }
}
