import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto, TestAnswerDto } from './dto/create-result.dto';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultsService.create(createResultDto);
  }

  @Get()
  findAll() {
    return this.resultsService.findAll();
  }

  @Get('by-user')
  findByUser(@Query('fullName') fullName: string) {
    if (!fullName) {
      throw new BadRequestException('Full name is required');
    }
    return this.resultsService.findByUser(fullName);
  }

  @Post('submit-test')
  async submitTest(
    @Body() submitData: { fullName: string; answers: TestAnswerDto[] }
  ) {
    const { fullName, answers } = submitData;
    
    if (!fullName || !answers || !Array.isArray(answers)) {
      throw new BadRequestException('Full name and answers are required');
    }

    // Validate full name format
    const cyrillicPattern = /^[А-ЯІЇЄЁа-яіїєё]+$/;
    const words = fullName.trim().split(/\s+/);
    
    if (words.length !== 3 || !words.every(word => 
      word.length >= 3 && 
      cyrillicPattern.test(word) &&
      word[0] === word[0].toUpperCase()
    )) {
      throw new BadRequestException(
        'Full name must be 3 Cyrillic words, each starting with capital letter and at least 3 characters long'
      );
    }

    const result = await this.resultsService.saveTestResult(fullName, answers);
    const knowledgeLevel = this.resultsService.getKnowledgeLevel(result.total_score);

    return {
      ...result.toObject(),
      knowledge_level: knowledgeLevel
    };
  }

  @Get('statistics')
  getStatistics() {
    return this.resultsService.getStatistics();
  }

  @Post('calculate')
  async calculateResult(
    @Body() calculateData: { fullName: string; answers: TestAnswerDto[] }
  ) {
    const { fullName, answers } = calculateData;
    
    if (!fullName || !answers || !Array.isArray(answers)) {
      throw new BadRequestException('Full name and answers are required');
    }

    const result = await this.resultsService.calculateTestResult(fullName, answers);
    const knowledgeLevel = this.resultsService.getKnowledgeLevel(result.totalScore);

    return {
      ...result,
      knowledge_level: knowledgeLevel
    };
  }
}