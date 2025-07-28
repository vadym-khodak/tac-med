import { SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Space, Typography, message } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

export const MainMenu: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [_fullName, setFullName] = useState('')

  const validateFullName = (_: any, value: string) => {
    if (!value) {
      return Promise.reject("Поле обов'язкове для заповнення")
    }

    const cyrillicPattern = /^[А-ЯІЇЄЁа-яіїєё]+$/
    const words = value.trim().split(/\s+/)

    if (words.length !== 3) {
      return Promise.reject("Введіть своє Прізвище Ім'я По-батькові через пробіл")
    }

    for (const word of words) {
      if (word.length < 3) {
        return Promise.reject("Введіть своє Прізвище Ім'я По-батькові через пробіл")
      }
      if (!cyrillicPattern.test(word)) {
        return Promise.reject("Введіть своє Прізвище Ім'я По-батькові через пробіл")
      }
      if (word[0] !== word[0].toUpperCase()) {
        return Promise.reject("Введіть своє Прізвище Ім'я По-батькові через пробіл")
      }
    }

    return Promise.resolve()
  }

  const handleUserSubmit = (values: { fullName: string }) => {
    setFullName(values.fullName)
    navigate('/test', { state: { fullName: values.fullName } })
  }

  const handleAdminClick = () => {
    navigate('/admin')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 500,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#1f2937', marginBottom: 8 }}>
            Тестування знань з тактичної медицини
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Програма для перевірки рівня теоретичних навичок
          </Text>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card
            title={
              <Space>
                <UserOutlined />
                Користувач
              </Space>
            }
            style={{ width: '100%' }}
          >
            <Form form={form} layout="vertical" onFinish={handleUserSubmit}>
              <Form.Item
                label="Прізвище Ім'я По-батькові"
                name="fullName"
                rules={[{ validator: validateFullName }]}
                help="Введіть три слова кирилицею, кожне починається з великої літери"
              >
                <Input
                  placeholder="Чернобай Степан Бандерович"
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  style={{
                    borderRadius: '8px',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  Розпочати тестування
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card
            title={
              <Space>
                <SettingOutlined />
                Адміністратор
              </Space>
            }
            style={{ width: '100%' }}
          >
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              Доступ до керування питаннями та перегляду статистики
            </Text>
            <Button
              type="default"
              size="large"
              block
              onClick={handleAdminClick}
              style={{
                borderRadius: '8px',
                height: '48px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Увійти як адміністратор
            </Button>
          </Card>
        </Space>
      </Card>
    </div>
  )
}
