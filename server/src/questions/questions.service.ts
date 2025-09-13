import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateQuestionDto, ImportQuestionsDto } from './dto/create-question.dto'
import { Question, QuestionDocument } from './question.schema'

@Injectable()
export class QuestionsService {
  constructor(@InjectModel(Question.name) private questionModel: Model<QuestionDocument>) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    this.validateQuestion(createQuestionDto)
    const createdQuestion = new this.questionModel(createQuestionDto)
    return createdQuestion.save()
  }

  async findAll(page = 1, pageSize = 10): Promise<{
    data: Question[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }> {
    const skip = (page - 1) * pageSize
    const total = await this.questionModel.countDocuments()
    const data = await this.questionModel.find().skip(skip).limit(pageSize).exec()

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  async findByBlock(block: number): Promise<Question[]> {
    return this.questionModel.find({ block }).exec()
  }

  async getRandomQuestionsByBlock(block: number, count = 10): Promise<Question[]> {
    const questions = await this.questionModel.aggregate([
      { $match: { block } },
      { $sample: { size: count } },
    ])

    if (questions.length < count) {
      throw new BadRequestException(
        `Not enough questions in block ${block}. Found ${questions.length}, need ${count}`,
      )
    }

    return questions
  }

  async findOne(id: string): Promise<Question> {
    return this.questionModel.findById(id).exec()
  }

  async update(id: string, updateQuestionDto: CreateQuestionDto): Promise<Question> {
    this.validateQuestion(updateQuestionDto)
    return this.questionModel.findByIdAndUpdate(id, updateQuestionDto, { new: true }).exec()
  }

  async remove(id: string): Promise<Question> {
    return this.questionModel.findByIdAndDelete(id).exec()
  }

  async importQuestions(importDto: ImportQuestionsDto): Promise<{ imported: number }> {
    // Validate all questions first
    importDto.questions.forEach((question, index) => {
      try {
        this.validateQuestion(question)
      } catch (error) {
        throw new BadRequestException(`Question ${index + 1}: ${error.message}`)
      }
    })

    // Clear existing questions and import new ones
    await this.questionModel.deleteMany({})
    const result = await this.questionModel.insertMany(importDto.questions)

    return { imported: result.length }
  }

  async getQuestionsCount(): Promise<Record<number, number>> {
    const pipeline = [
      {
        $group: {
          _id: '$block',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 as const },
      },
    ]

    const results = await this.questionModel.aggregate(pipeline)
    const counts: Record<number, number> = {}

    for (let i = 1; i <= 6; i++) {
      counts[i] = 0
    }

    for (const result of results) {
      counts[result._id] = result.count
    }

    return counts
  }

  async exportAll(): Promise<Question[]> {
    return this.questionModel.find().sort({ block: 1 }).exec()
  }

  private validateQuestion(question: CreateQuestionDto): void {
    // Validate block
    if (question.block < 1 || question.block > 6) {
      throw new BadRequestException('Block must be between 1 and 6')
    }

    // Validate answers array
    if (!Array.isArray(question.answers) || question.answers.length !== 4) {
      throw new BadRequestException('Answers must be an array of exactly 4 items')
    }

    // Validate correct answers indices
    if (!Array.isArray(question.correct) || question.correct.length === 0) {
      throw new BadRequestException('Correct answers array cannot be empty')
    }

    const invalidIndices = question.correct.filter((index) => index < 0 || index >= 4)
    if (invalidIndices.length > 0) {
      throw new BadRequestException('All correct answer indices must be between 0 and 3')
    }

    // Check for duplicate indices
    const uniqueIndices = [...new Set(question.correct)]
    if (uniqueIndices.length !== question.correct.length) {
      throw new BadRequestException('Correct answers array cannot contain duplicates')
    }
  }
}
