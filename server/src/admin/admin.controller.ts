import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { QuestionsService } from '../questions/questions.service'
import { ResultsService } from '../results/results.service'
import { AdminService } from './admin.service'

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly resultsService: ResultsService,
    private readonly questionsService: QuestionsService,
  ) {}

  @Post('login')
  async login(@Body() loginData: { password: string }) {
    const { password } = loginData
    
    if (!password) {
      throw new BadRequestException('Password is required')
    }

    return this.adminService.generateAdminToken(password)
  }

  @Post('change-password')
  async changePassword(
    @Headers('authorization') authorization: string,
    @Body() changePasswordData: { oldPassword: string; newPassword: string },
  ) {
    const token = this.extractToken(authorization)

    if (!this.adminService.validateAdminToken(token)) {
      throw new UnauthorizedException('Invalid or expired admin token')
    }

    const { oldPassword, newPassword } = changePasswordData

    if (!oldPassword || !newPassword) {
      throw new BadRequestException('Old password and new password are required')
    }

    return this.adminService.changePassword(oldPassword, newPassword)
  }

  @Get('dashboard')
  async getDashboard(@Headers('authorization') authorization: string) {
    const token = this.extractToken(authorization)

    if (!this.adminService.validateAdminToken(token)) {
      throw new UnauthorizedException('Invalid or expired admin token')
    }

    const [statistics, questionsCount] = await Promise.all([
      this.resultsService.getStatistics(),
      this.questionsService.getQuestionsCount(),
    ])

    return {
      statistics,
      questionsCount,
    }
  }

  @Get('results')
  async getAllResults(@Headers('authorization') authorization: string) {
    const token = this.extractToken(authorization)

    if (!this.adminService.validateAdminToken(token)) {
      throw new UnauthorizedException('Invalid or expired admin token')
    }

    const results = await this.resultsService.findAll()

    return results.map((result) => ({
      ...result.toObject(),
      knowledge_level: this.resultsService.getKnowledgeLevel(result.total_score),
    }))
  }

  @Get('questions')
  async getAllQuestions(@Headers('authorization') authorization: string, @Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    const token = this.extractToken(authorization)

    if (!this.adminService.validateAdminToken(token)) {
      throw new UnauthorizedException('Invalid or expired admin token')
    }

    const pageNum = page ? Number(page) : 1
    const pageSizeNum = pageSize ? Number(pageSize) : 10

    if (Number.isNaN(pageNum) || pageNum < 1) {
      throw new BadRequestException('Page must be a positive number')
    }

    if (Number.isNaN(pageSizeNum) || pageSizeNum < 1) {
      throw new BadRequestException('Page size must be a positive number')
    }

    return this.questionsService.findAll(pageNum, pageSizeNum)
  }

  private extractToken(authorization: string): string {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header is required')
    }

    return authorization.substring(7)
  }
}
