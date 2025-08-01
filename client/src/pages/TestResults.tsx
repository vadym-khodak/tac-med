import { CheckCircleOutlined, HomeOutlined } from '@ant-design/icons'
import { Button, Card, Progress, Space, Table, Tag, Typography } from 'antd'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BLOCK_NAMES, KnowledgeLevel, TestResult } from '../types'

const { Title, Text } = Typography

const getKnowledgeLevelColor = (level: KnowledgeLevel): string => {
  switch (level) {
    case 'Максимальний':
      return 'gold'
    case 'Високий':
      return 'green'
    case 'Середній':
      return 'blue'
    case 'Початковий':
      return 'orange'
    case 'Низький':
      return 'red'
    default:
      return 'default'
  }
}

export const TestResults: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { result, fullName } = location.state || {}
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!result || !fullName) {
    navigate('/')
    return null
  }

  const typedResult = result as TestResult

  const blockColumns = [
    {
      title: 'Блок',
      dataIndex: 'block',
      key: 'block',
      render: (block: number) => isMobile 
        ? `${block}. ${BLOCK_NAMES[block as keyof typeof BLOCK_NAMES].substring(0, 15)}...`
        : `${block}. ${BLOCK_NAMES[block as keyof typeof BLOCK_NAMES]}`,
      width: isMobile ? 120 : undefined,
    },
    {
      title: isMobile ? 'Прав.' : 'Правильних відповідей',
      dataIndex: 'correct',
      key: 'correct',
      render: (correct: number) => `${correct}/10`,
      align: 'center' as const,
      width: isMobile ? 60 : undefined,
    },
    {
      title: 'Відсоток',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => (
        <Progress
          percent={percentage}
          size="small"
          status={percentage >= 60 ? 'success' : 'exception'}
          style={{ minWidth: isMobile ? '60px' : '100px' }}
        />
      ),
      width: isMobile ? 80 : undefined,
    },
  ]

  const blockData = Object.entries(typedResult.block_scores).map(([block, percentage]) => ({
    key: block,
    block: Number.parseInt(block),
    correct: Math.round((percentage / 100) * 10),
    percentage,
  }))

  const totalCorrect = blockData.reduce((sum, block) => sum + block.correct, 0)

  const handleBackToMenu = () => {
    navigate('/')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: isMobile ? '12px' : '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card style={{ maxWidth: isMobile ? '100%' : 800, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 32 }}>
          <CheckCircleOutlined
            style={{
              fontSize: isMobile ? '48px' : '64px',
              color: '#52c41a',
              marginBottom: isMobile ? 12 : 16,
            }}
          />
          <Title level={isMobile ? 3 : 2}>Результати тестування</Title>
          <Text type="secondary" style={{ fontSize: isMobile ? '14px' : '16px' }}>
            {fullName}
          </Text>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Block Results Table */}
          <Card title="Результати по блоках" size="small">
            <Table 
              columns={blockColumns} 
              dataSource={blockData} 
              pagination={false} 
              size="small"
              scroll={{ x: isMobile ? 300 : undefined }}
            />
          </Card>

          {/* Overall Statistics */}
          <Card title="Загальна статистика" size="small">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: isMobile ? '8px' : '0',
                  padding: isMobile ? '12px' : '16px',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                }}
              >
                <Text strong style={{ fontSize: isMobile ? '14px' : '16px' }}>
                  Загальна кількість правильних відповідей
                </Text>
                <Text style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 'bold', color: '#1890ff' }}>
                  {totalCorrect} з 60
                </Text>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: isMobile ? '8px' : '0',
                  padding: isMobile ? '12px' : '16px',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                }}
              >
                <Text strong style={{ fontSize: isMobile ? '14px' : '16px' }}>
                  Загальний відсоток правильних відповідей
                </Text>
                <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                  <Text style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {Math.round(typedResult.total_score)}%
                  </Text>
                  <Progress
                    percent={Math.round(typedResult.total_score)}
                    size="small"
                    status={Math.round(typedResult.total_score) >= 60 ? 'success' : 'exception'}
                    style={{ width: isMobile ? '100%' : '200px', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: isMobile ? '8px' : '0',
                  padding: isMobile ? '12px' : '16px',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                }}
              >
                <Text strong style={{ fontSize: isMobile ? '14px' : '16px' }}>
                  Ваш рівень теоретичних знань з тактичної медицини
                </Text>
                <Tag
                  color={getKnowledgeLevelColor(typedResult.knowledge_level as KnowledgeLevel)}
                  style={{ fontSize: isMobile ? '14px' : '16px', padding: isMobile ? '6px 12px' : '8px 16px', fontWeight: 'bold' }}
                >
                  {typedResult.knowledge_level}
                </Tag>
              </div>
            </Space>
          </Card>

          {/* Knowledge Level Explanation */}
          <Card title="Шкала оцінювання" size="small">
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>0–20%</Text>
                <Tag color="red">Низький</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>21–50%</Text>
                <Tag color="orange">Початковий</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>51–80%</Text>
                <Tag color="blue">Середній</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>81–95%</Text>
                <Tag color="green">Високий</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>96–100%</Text>
                <Tag color="gold">Максимальний</Tag>
              </div>
            </Space>
          </Card>

          {/* Incorrect Questions */}
          {typedResult.incorrect_list && typedResult.incorrect_list.length > 0 && (
            <Card title="Питання з неправильними відповідями" size="small">
              <ul>
                {typedResult.incorrect_list.map((question) => (
                  <li key={question} style={{ marginBottom: '8px' }}>
                    <Text>{question}</Text>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Back to Menu Button */}
          <div style={{ textAlign: 'center', marginTop: isMobile ? 24 : 32 }}>
            <Button
              type="primary"
              size={isMobile ? 'middle' : 'large'}
              icon={<HomeOutlined />}
              onClick={handleBackToMenu}
              style={{
                width: isMobile ? '100%' : undefined,
                minWidth: isMobile ? undefined : '200px',
                height: isMobile ? '40px' : '48px',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 'bold',
              }}
            >
              {isMobile ? 'Ознайомлений' : 'З результатами тестування ознайомлений'}
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  )
}
