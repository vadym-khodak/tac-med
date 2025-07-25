import api from './api'

export interface IUser {
  id?: string
  name: string
  email: string
  role: 'admin' | 'member'
}

export const userService = {
  getUsers: async (): Promise<IUser[]> => {
    const response = await api.get('/users')
    return response.data
  },

  getUser: async (id: string): Promise<IUser | undefined> => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  createUser: async (user: Omit<IUser, 'id'>): Promise<IUser> => {
    const response = await api.post('/users', user)
    return response.data
  },

  updateUser: async (id: string, user: Partial<IUser>): Promise<IUser | undefined> => {
    const response = await api.put(`/users/${id}`, user)
    return response.data
  },

  deleteUser: async (id: string): Promise<boolean> => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
}
