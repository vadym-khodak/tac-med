import axios, { AxiosError } from 'axios'
import { Question, TestAnswer, TestResult, AdminStats, QuestionCount } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

if (!API_URL) {
  console.error('VITE_API_URL environment variable is not set')
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout
  timeout: 10000,
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Log the error for debugging
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      },
    })
    return Promise.reject(error)
  },
)

// Questions API
export const questionsApi = {
  getTestSet: async (): Promise<{ questions: Question[] }> => {
    const response = await api.get('/questions/test-set')
    return response.data
  },

  getAll: async (): Promise<Question[]> => {
    const response = await api.get('/questions')
    return response.data
  },

  getByBlock: async (block: number): Promise<Question[]> => {
    const response = await api.get(`/questions/by-block/${block}`)
    return response.data
  },

  getCounts: async (): Promise<QuestionCount> => {
    const response = await api.get('/questions/counts')
    return response.data
  },

  import: async (questions: any[], token: string): Promise<{ imported: number }> => {
    const response = await api.post(
      '/questions/import',
      { questions },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    return response.data
  },

  create: async (question: Omit<Question, '_id'>, token: string): Promise<Question> => {
    const response = await api.post('/questions', question, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },

  update: async (id: string, question: Omit<Question, '_id'>, token: string): Promise<Question> => {
    const response = await api.patch(`/questions/${id}`, question, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },

  delete: async (id: string, token: string): Promise<void> => {
    await api.delete(`/questions/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  },
}

// Results API
export const resultsApi = {
  submitTest: async (fullName: string, answers: TestAnswer[]): Promise<TestResult> => {
    const response = await api.post('/results/submit-test', {
      fullName,
      answers,
    })
    return response.data
  },

  calculate: async (fullName: string, answers: TestAnswer[]): Promise<any> => {
    const response = await api.post('/results/calculate', {
      fullName,
      answers,
    })
    return response.data
  },

  getAll: async (token: string): Promise<TestResult[]> => {
    const response = await api.get('/results', { headers: { Authorization: `Bearer ${token}` } })
    return response.data
  },

  getByUser: async (fullName: string): Promise<TestResult[]> => {
    const response = await api.get(`/results/by-user?fullName=${encodeURIComponent(fullName)}`)
    return response.data
  },

  getStatistics: async (): Promise<AdminStats> => {
    const response = await api.get('/results/statistics')
    return response.data
  },
}

// Admin API
export const adminApi = {
  login: async (password: string): Promise<{ token: string }> => {
    const response = await api.post('/admin/login', { password })
    return response.data
  },

  changePassword: async (
    token: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean }> => {
    const response = await api.post(
      '/admin/change-password',
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    return response.data
  },

  getDashboard: async (
    token: string,
  ): Promise<{ statistics: AdminStats; questionsCount: QuestionCount }> => {
    const response = await api.get('/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },

  getAllResults: async (token: string): Promise<TestResult[]> => {
    const response = await api.get('/admin/results', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },

  getAllQuestions: async (token: string): Promise<Question[]> => {
    const response = await api.get('/admin/questions', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },
}

export const healthApi = {
  checkHealth: async () => {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  },
}

export default api
