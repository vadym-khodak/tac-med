import axios, { AxiosError } from 'axios'
import { useAuth } from '../hooks/useAuth'

const API_URL = import.meta.env.VITE_API_URL

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

export const setupInterceptors = (getToken: () => Promise<string>) => {
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      } catch (error) {
        console.error('Error getting token:', error)
        return Promise.reject(error)
      }
    },
    (error) => {
      console.error('Request interceptor error:', error)
      return Promise.reject(error)
    },
  )
}

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth()
  setupInterceptors(getAccessTokenSilently)
  return api
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
