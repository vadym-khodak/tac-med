import React from 'react'
import { Card, Button, Typography, Space, Table, Progress, Tag } from 'antd'
import { CheckCircleOutlined, HomeOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { TestResult, BLOCK_NAMES, KnowledgeLevel } from '../types'

const { Title, Text, Paragraph } = Typography

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
      render: (block: number) => `${block}. ${BLOCK_NAMES[block as keyof typeof BLOCK_NAMES]}`,
    },
    {
      title: 'Правильних відповідей',
      dataIndex: 'correct',
      key: 'correct',
      render: (correct: number) => `${correct} з 10`,
      align: 'center' as const,
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
        />
      ),
    },
  ]

  const blockData = Object.entries(typedResult.block_scores).map(([block, percentage]) => ({
    key: block,
    block: parseInt(block),
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
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card style={{ maxWidth: 800, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <CheckCircleOutlined
            style={{
              fontSize: '64px',
              color: '#52c41a',
              marginBottom: 16,
            }}
          />
          <Title level={2}>Результати тестування</Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            {fullName}
          </Text>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Block Results Table */}
          <Card title="Результати по блоках" size="small">
            <Table columns={blockColumns} dataSource={blockData} pagination={false} size="small" />
          </Card>

          {/* Overall Statistics */}
          <Card title="Загальна статистика" size="small">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                }}
              >
                <Text strong style={{ fontSize: '16px' }}>
                  Загальна кількість правильних відповідей
                </Text>
                <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                  {totalCorrect} з 60
                </Text>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                }}
              >
                <Text strong style={{ fontSize: '16px' }}>
                  Загальний відсоток правильних відповідей
                </Text>
                <div style={{ textAlign: 'right' }}>
                  <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {typedResult.total_score}%
                  </Text>
                  <Progress
                    percent={typedResult.total_score}
                    size="small"
                    status={typedResult.total_score >= 60 ? 'success' : 'exception'}
                    style={{ width: '200px', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                }}
              >
                <Text strong style={{ fontSize: '16px' }}>
                  Ваш рівень теоретичних знань з тактичної медицини
                </Text>
                <Tag
                  color={getKnowledgeLevelColor(typedResult.knowledge_level as KnowledgeLevel)}
                  style={{ fontSize: '16px', padding: '8px 16px', fontWeight: 'bold' }}
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
                {typedResult.incorrect_list.map((question, index) => (
                  <li key={index} style={{ marginBottom: '8px' }}>
                    <Text>{question}</Text>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Back to Menu Button */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={handleBackToMenu}
              style={{
                minWidth: '200px',
                height: '48px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              З результатами тестування ознайомлений
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  )
}
