export interface Question {
  _id: string
  block: number
  question: string
  answers: string[]
  correct: number[]
  image_path?: string
  youtube_url?: string
}

export interface TestAnswer {
  question_id: string
  selected_answers: number[]
}

export interface TestResult {
  _id?: string
  full_name: string
  test_date: Date
  block_scores: Record<string, number>
  total_score: number
  incorrect_list: string[]
  knowledge_level?: string
}

export interface AdminStats {
  totalTests: number
  averageScore: number
  levelDistribution: Record<string, number>
  recentTests: TestResult[]
}

export interface QuestionCount {
  [block: number]: number
}

export interface TestState {
  fullName: string
  currentQuestionIndex: number
  questions: Question[]
  answers: TestAnswer[]
  timeRemaining: number
  isSubmitted: boolean
  result?: TestResult
}

export type KnowledgeLevel = 'Низький' | 'Початковий' | 'Середній' | 'Високий' | 'Максимальний'

export const BLOCK_NAMES = {
  1: 'Загальні питання',
  2: 'Масивна кровотеча (Massive Hemorrhage)',
  3: 'Дихальні шляхи (Airway)',
  4: 'Дихання (Respiration)',
  5: 'Кровообіг (Circulation)',
  6: 'Гіпотермія/травма голови (Hypothermia/Head Injury)',
} as const
