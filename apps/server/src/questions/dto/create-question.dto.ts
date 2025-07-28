import {
  IsArray,
  IsNumber,
  IsString,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
} from 'class-validator'

export class CreateQuestionDto {
  @IsNumber()
  @Min(1)
  @Max(6)
  block: number

  @IsString()
  question: string

  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @IsString({ each: true })
  answers: string[]

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @IsNumber({}, { each: true })
  correct: number[]

  @IsOptional()
  @IsString()
  image_path?: string

  @IsOptional()
  @IsString()
  youtube_url?: string
}

export class UpdateQuestionDto extends CreateQuestionDto {}

export class ImportQuestionsDto {
  @IsArray()
  questions: CreateQuestionDto[]
}
