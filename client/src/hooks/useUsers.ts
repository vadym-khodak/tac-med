import { useState } from 'react'
import useSWR from 'swr'
import { useApi } from '../services/api'
import { IUser } from '../services/userService'

interface FormData {
  name: string
  email: string
  role: 'admin' | 'member'
}

export const useUsers = () => {
  const api = useApi()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<IUser | null>(null)
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null)
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', role: 'member' })

  const {
    data: users,
    error,
    mutate,
  } = useSWR<IUser[]>('/users', async () => {
    const response = await api.get('/users')
    return response.data
  })

  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({ name: '', email: '', role: 'member' })
    setIsModalVisible(true)
  }

  const handleEditUser = (user: IUser) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, role: user.role as 'admin' | 'member' })
    setIsModalVisible(true)
  }

  const handleDeleteClick = (user: IUser) => {
    setUserToDelete(user)
    setIsDeleteModalVisible(true)
  }

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await api.delete(`/users/${userToDelete.id}`)
        await mutate()
        setIsDeleteModalVisible(false)
        setUserToDelete(null)
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false)
    setUserToDelete(null)
  }

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData)
      } else {
        await api.post('/users', formData)
      }
      await mutate()
      setIsModalVisible(false)
      setEditingUser(null)
      setFormData({ name: '', email: '', role: 'member' })
    } catch (error) {
      console.error('Error submitting user:', error)
    }
  }

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return {
    users,
    isLoading: !error && !users,
    error,
    isModalVisible,
    setIsModalVisible,
    isDeleteModalVisible,
    editingUser,
    userToDelete,
    formData,
    handleAddUser,
    handleEditUser,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleSubmit,
    handleFormChange,
  }
}
