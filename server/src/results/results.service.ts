import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { QuestionsService } from '../questions/questions.service'
import { CreateResultDto, TestAnswerDto } from './dto/create-result.dto'
import { Result, ResultDocument } from './result.schema'

@Injectable()
export class ResultsService {
  constructor(
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
    private questionsService: QuestionsService,
  ) {}

  async create(createResultDto: CreateResultDto): Promise<ResultDocument> {
    const createdResult = new this.resultModel(createResultDto)
    return createdResult.save()
  }

  async findAll(): Promise<ResultDocument[]> {
    return this.resultModel.find().sort({ test_date: -1 }).exec()
  }

  async findByUser(fullName: string): Promise<ResultDocument[]> {
    return this.resultModel.find({ full_name: fullName }).sort({ test_date: -1 }).exec()
  }

  async calculateTestResult(
    _fullName: string,
    answers: TestAnswerDto[],
  ): Promise<{
    blockScores: Record<string, number>
    totalScore: number
    incorrectQuestions: string[]
    correctCount: number
    totalQuestions: number
  }> {
    const blockScores: Record<string, number> = {}
    const incorrectQuestions: string[] = []
    let totalCorrect = 0
    const totalQuestions = answers.length

    // Group answers by block
    const answersByBlock: Record<number, TestAnswerDto[]> = {}

    for (const answer of answers) {
      const question = await this.questionsService.findOne(answer.question_id)
      if (!question) continue

      if (!answersByBlock[question.block]) {
        answersByBlock[question.block] = []
      }
      answersByBlock[question.block].push(answer)
    }

    // Calculate scores for each block
    for (let block = 1; block <= 6; block++) {
      const blockAnswers = answersByBlock[block] || []
      let blockCorrect = 0

      for (const answer of blockAnswers) {
        const question = await this.questionsService.findOne(answer.question_id)
        if (!question) continue

        const isCorrect = this.isAnswerCorrect(question.correct, answer.selected_answers)
        if (isCorrect) {
          blockCorrect++
          totalCorrect++
        } else {
          incorrectQuestions.push(question.question)
        }
      }

      // Calculate block percentage (out of 10 questions per block)
      const blockTotal = Math.max(blockAnswers.length, 10)
      blockScores[block.toString()] = Math.round((blockCorrect / blockTotal) * 100)
    }

    // Ensure all blocks have scores (default to 0 if no questions answered)
    for (let block = 1; block <= 6; block++) {
      if (!blockScores[block.toString()]) {
        blockScores[block.toString()] = 0
      }
    }

    const totalScore = Math.round((totalCorrect / Math.max(totalQuestions, 60)) * 100)

    return {
      blockScores,
      totalScore,
      incorrectQuestions,
      correctCount: totalCorrect,
      totalQuestions: Math.max(totalQuestions, 60),
    }
  }

  async saveTestResult(fullName: string, answers: TestAnswerDto[]): Promise<ResultDocument> {
    const result = await this.calculateTestResult(fullName, answers)

    const createResultDto: CreateResultDto = {
      full_name: fullName,
      block_scores: result.blockScores,
      total_score: result.totalScore,
      incorrect_list: result.incorrectQuestions,
    }

    return this.create(createResultDto)
  }

  getKnowledgeLevel(score: number): string {
    if (score >= 96) return 'Максимальний'
    if (score >= 81) return 'Високий'
    if (score >= 51) return 'Середній'
    if (score >= 21) return 'Початковий'
    return 'Низький'
  }

  private isAnswerCorrect(correctAnswers: number[], selectedAnswers: number[]): boolean {
    if (!selectedAnswers || selectedAnswers.length === 0) {
      return false
    }

    // Calculate the percentage of correct answers selected
    const correctSelected = selectedAnswers.filter((answer) => correctAnswers.includes(answer))
    const incorrectSelected = selectedAnswers.filter((answer) => !correctAnswers.includes(answer))

    // If user selected incorrect answers, they get 0%
    if (incorrectSelected.length > 0) {
      return false
    }

    // Calculate percentage: correct selected / total correct * 100
    const percentage = (correctSelected.length / correctAnswers.length) * 100

    // Answer is correct if user got 60% or more of the correct answers
    return percentage >= 60
  }

  async getStatistics(): Promise<{
    totalTests: number
    averageScore: number
    levelDistribution: Record<string, number>
    recentTests: Result[]
  }> {
    const totalTests = await this.resultModel.countDocuments()

    const averageResult = await this.resultModel.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$total_score' },
        },
      },
    ])

    const averageScore = averageResult.length > 0 ? Math.round(averageResult[0].averageScore) : 0

    // Get level distribution
    const results = await this.resultModel.find({}, 'total_score').exec()
    const levelDistribution: Record<string, number> = {
      Низький: 0,
      Початковий: 0,
      Середній: 0,
      Високий: 0,
      Максимальний: 0,
    }

    for (const result of results) {
      const level = this.getKnowledgeLevel(result.total_score)
      levelDistribution[level]++
    }

    const recentTests = await this.resultModel.find().sort({ test_date: -1 }).limit(10).exec()

    return {
      totalTests,
      averageScore,
      levelDistribution,
      recentTests,
    }
  }
}
