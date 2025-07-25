import { Button, Card, Space, Typography } from 'antd'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const { Title } = Typography

export const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--background-color)',
      }}
    >
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2}>TacMed</Title>
          <Button type="primary" size="large" onClick={login} block>
            Log In with Auth0
          </Button>
        </Space>
      </Card>
    </div>
  )
}
