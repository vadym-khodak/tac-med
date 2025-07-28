import { IsString, IsNumber, IsArray, IsObject, Min, Max, Matches } from 'class-validator'

export class CreateResultDto {
  @IsString()
  @Matches(/^[А-ЯІЇЄЁа-яіїєё]+\s+[А-ЯІЇЄЁа-яіїєё]+\s+[А-ЯІЇЄЁа-яіїєё]+$/, {
    message: 'Full name must be 3 Cyrillic words separated by spaces',
  })
  full_name: string

  @IsObject()
  block_scores: Record<string, number>

  @IsNumber()
  @Min(0)
  @Max(100)
  total_score: number

  @IsArray()
  @IsString({ each: true })
  incorrect_list: string[]
}

export class TestAnswerDto {
  @IsNumber()
  question_id: string

  @IsArray()
  @IsNumber({}, { each: true })
  selected_answers: number[]
}
