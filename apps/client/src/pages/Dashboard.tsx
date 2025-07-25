import { Alert, Button, Card, Layout, Spin, Typography } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { healthApi } from '../services/api'

const { Title, Text } = Typography

interface HealthStatus {
  status: string
  timestamp: string
  details?: {
    mongodb?: {
      status: string
      readyState?: number
      error?: string
    }
  }
}

const Dashboard = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        setLoading(true)
        const data = await healthApi.checkHealth()
        setHealthStatus(data)
        setError(null)
      } catch (err: unknown) {
        let errorMessage = 'Failed to connect to the server. Please try again later.'

        if (err instanceof Error) {
          errorMessage = err.message
        }

        if (axios.isAxiosError(err)) {
          errorMessage =
            err.response?.data?.details?.mongodb?.error ||
            err.response?.data?.message ||
            errorMessage
        }

        setError(errorMessage)
        console.error('Error fetching health status:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHealthStatus()

    // Poll health status every 30 seconds
    const interval = setInterval(fetchHealthStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>TacMed Dashboard</Title>

        <Card title="Server Status" style={{ marginBottom: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin size="large" />
              <Text style={{ display: 'block', marginTop: '10px' }}>Checking server status...</Text>
            </div>
          ) : error ? (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              action={
                <Button size="small" type="primary" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              }
            />
          ) : (
            <div>
              <Alert
                message={`Status: ${healthStatus?.status}`}
                description={
                  <div>
                    <Text>
                      Last Checked: {new Date(healthStatus?.timestamp || '').toLocaleString()}
                    </Text>
                    {healthStatus?.details && (
                      <div style={{ marginTop: '8px' }}>
                        <Text strong>MongoDB Status: </Text>
                        <Text>{healthStatus.details.mongodb?.status}</Text>
                        {healthStatus.details.mongodb?.readyState && (
                          <div>
                            <Text strong>Ready State: </Text>
                            <Text>{healthStatus.details.mongodb.readyState}</Text>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                }
                type={healthStatus?.status === 'ok' ? 'success' : 'warning'}
                showIcon
              />
            </div>
          )}
        </Card>

        {/* Add more dashboard content here */}
      </Content>
    </Layout>
  )
}

export default Dashboard
