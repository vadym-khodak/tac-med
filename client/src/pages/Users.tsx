import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Select, Space, Table } from 'antd'
import { useEffect } from 'react'
import { useUsers } from '../hooks/useUsers'
import { IUser } from '../services/userService'

const Users = () => {
  const {
    users,
    isLoading,
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
  } = useUsers()

  const [form] = Form.useForm()

  // Update form values when formData changes
  useEffect(() => {
    form.setFieldsValue(formData)
  }, [form, formData])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: IUser) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditUser(record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteClick(record)} />
        </Space>
      ),
    },
  ]

  const handleModalOk = () => {
    form
      .validateFields()
      .then(() => {
        handleSubmit()
        form.resetFields()
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  if (error) {
    return <div>Error loading users: {error.message}</div>
  }

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Users</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
            Add User
          </Button>
        </div>
      </div>

      <Table dataSource={users} columns={columns} rowKey="id" loading={isLoading} />

      {/* Edit/Add User Modal */}
      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(_, allValues) => {
            handleFormChange('name', allValues.name)
            handleFormChange('email', allValues.email)
            handleFormChange('role', allValues.role)
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select
              options={[
                { label: 'Admin', value: 'admin' },
                { label: 'Member', value: 'member' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete User"
        open={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Yes, Delete"
        cancelText="No, Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete {userToDelete?.name}?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  )
}

export default Users
