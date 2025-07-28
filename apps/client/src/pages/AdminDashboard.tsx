import {
  BarChartOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileTextOutlined,
  LogoutOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { QuestionForm } from '../components/QuestionForm'
import { adminApi, questionsApi } from '../services/api'
import {
  AdminStats,
  BLOCK_NAMES,
  KnowledgeLevel,
  Question,
  QuestionCount,
  TestResult,
} from '../types'

const { Title, Text } = Typography
const { TabPane } = Tabs

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState<AdminStats | null>(null)
  const [questionsCount, setQuestionsCount] = useState<QuestionCount>({})
  const [results, setResults] = useState<TestResult[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [importModal, setImportModal] = useState(false)
  const [questionFormDrawer, setQuestionFormDrawer] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [changePasswordForm] = Form.useForm()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }
    loadDashboardData(token)
  }, [navigate])

  const loadDashboardData = async (token: string) => {
    try {
      setLoading(true)
      const [dashboardData, resultsData, questionsData] = await Promise.all([
        adminApi.getDashboard(token),
        adminApi.getAllResults(token),
        adminApi.getAllQuestions(token),
      ])

      setStatistics(dashboardData.statistics)
      setQuestionsCount(dashboardData.questionsCount)
      setResults(resultsData)
      setQuestions(questionsData)
    } catch (_error) {
      message.error('Помилка завантаження даних')
      navigate('/admin')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin')
  }

  const handleChangePassword = async (values: { oldPassword: string; newPassword: string }) => {
    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      await adminApi.changePassword(token, values.oldPassword, values.newPassword)
      message.success('Пароль успішно змінено')
      setChangePasswordModal(false)
      changePasswordForm.resetFields()
    } catch (_error) {
      message.error('Помилка зміни паролю')
    }
  }

  const handleExportResults = () => {
    const exportData = results.map((result) => ({
      ПІБ: result.full_name,
      Дата: new Date(result.test_date).toLocaleDateString('uk-UA'),
      'Блок 1': `${Math.round((result.block_scores['1'] || 0) / 10)} з 10`,
      'Блок 2': `${Math.round((result.block_scores['2'] || 0) / 10)} з 10`,
      'Блок 3': `${Math.round((result.block_scores['3'] || 0) / 10)} з 10`,
      'Блок 4': `${Math.round((result.block_scores['4'] || 0) / 10)} з 10`,
      'Блок 5': `${Math.round((result.block_scores['5'] || 0) / 10)} з 10`,
      'Блок 6': `${Math.round((result.block_scores['6'] || 0) / 10)} з 10`,
      'Загальний результат': `${Object.values(result.block_scores).reduce((sum, score) => sum + Math.round(score / 10), 0)} з 60 (${result.total_score}%)`,
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Результати тестування')
    XLSX.writeFile(wb, 'tactical-medicine-results.xlsx')
  }

  const handleImportQuestions = async (file: File) => {
    const token = localStorage.getItem('adminToken')
    if (!token) return false

    try {
      const text = await file.text()
      const questionsData = JSON.parse(text)

      await questionsApi.import(questionsData, token)
      message.success(`Успішно імпортовано ${questionsData.length} питань`)

      // Reload data
      loadDashboardData(token)
      setImportModal(false)

      return false // Prevent default upload
    } catch (_error) {
      message.error('Помилка імпорту питань. Перевірте формат файлу.')
      return false
    }
  }

  // Question management functions
  const handleCreateQuestion = () => {
    setEditingQuestion(null)
    setQuestionFormDrawer(true)
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setQuestionFormDrawer(true)
  }

  const handleDeleteQuestion = async (id: string) => {
    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      await questionsApi.delete(id, token)
      message.success('Питання видалено')
      loadDashboardData(token)
    } catch (_error) {
      message.error('Помилка видалення питання')
    }
  }

  const handleQuestionSubmit = async (values: Omit<Question, '_id'>) => {
    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      setFormLoading(true)
      if (editingQuestion) {
        await questionsApi.update(editingQuestion._id, values, token)
        message.success('Питання оновлено')
      } else {
        await questionsApi.create(values, token)
        message.success('Питання додано')
      }
      setQuestionFormDrawer(false)
      loadDashboardData(token)
    } catch (_error) {
      message.error(editingQuestion ? 'Помилка оновлення питання' : 'Помилка створення питання')
    } finally {
      setFormLoading(false)
    }
  }

  const resultsColumns = [
    {
      title: 'ПІБ',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 200,
    },
    {
      title: 'Дата',
      dataIndex: 'test_date',
      key: 'test_date',
      render: (date: string) => new Date(date).toLocaleDateString('uk-UA'),
      width: 100,
    },
    ...Array.from({ length: 6 }, (_, i) => ({
      title: `Блок ${i + 1}`,
      key: `block_${i + 1}`,
      render: (record: TestResult) =>
        `${Math.round((record.block_scores[`${i + 1}`] || 0) / 10)} з 10`,
      width: 80,
      align: 'center' as const,
    })),
    {
      title: 'Загальний результат',
      key: 'total',
      render: (record: TestResult) => {
        const total = Object.values(record.block_scores).reduce(
          (sum, score) => sum + Math.round(score / 10),
          0,
        )
        return `${total} з 60 (${record.total_score}%)`
      },
      width: 150,
    },
    {
      title: 'Рівень',
      dataIndex: 'knowledge_level',
      key: 'knowledge_level',
      render: (level: KnowledgeLevel) => (
        <Tag
          color={
            level === 'Максимальний'
              ? 'gold'
              : level === 'Високий'
                ? 'green'
                : level === 'Середній'
                  ? 'blue'
                  : level === 'Початковий'
                    ? 'orange'
                    : 'red'
          }
        >
          {level}
        </Tag>
      ),
      width: 120,
    },
  ]

  const questionsColumns = [
    {
      title: 'Блок',
      dataIndex: 'block',
      key: 'block',
      render: (block: number) => `${block}. ${BLOCK_NAMES[block as keyof typeof BLOCK_NAMES]}`,
      width: 300,
    },
    {
      title: 'Питання',
      dataIndex: 'question',
      key: 'question',
      ellipsis: true,
    },
    {
      title: 'Правильні відповіді',
      dataIndex: 'correct',
      key: 'correct',
      render: (correct: number[], record: Question) => (
        <Space direction="vertical" size="small">
          {correct.map((index) => (
            <Text key={index} style={{ fontSize: '12px' }}>
              ✓ {record.answers[index]}
            </Text>
          ))}
        </Space>
      ),
      width: 200,
    },
    {
      title: 'Медіа',
      key: 'media',
      render: (record: Question) => (
        <Space>
          {record.youtube_url && <Tag color="red">YouTube</Tag>}
          {record.image_path && <Tag color="blue">Зображення</Tag>}
        </Space>
      ),
      width: 100,
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (record: Question) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditQuestion(record)}
            size="small"
          >
            Редагувати
          </Button>
          <Popconfirm
            title="Видалити питання?"
            description="Ця дія незворотна. Питання буде видалено назавжди."
            onConfirm={() => handleDeleteQuestion(record._id)}
            okText="Так"
            cancelText="Ні"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Видалити
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 150,
      fixed: 'right' as const,
    },
  ]

  if (loading) {
    return <div>Завантаження...</div>
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>
            Панель адміністратора
          </Title>
          <Space>
            <Button icon={<SettingOutlined />} onClick={() => setChangePasswordModal(true)}>
              Змінити пароль
            </Button>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              Вихід
            </Button>
          </Space>
        </div>
      </Card>

      <Tabs defaultActiveKey="statistics">
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Статистика
            </span>
          }
          key="statistics"
        >
          {/* Statistics */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Всього тестів"
                  value={statistics?.totalTests || 0}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Середній бал"
                  value={statistics?.averageScore || 0}
                  suffix="%"
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Всього питань"
                  value={Object.values(questionsCount).reduce((sum, count) => sum + count, 0)}
                  prefix={<QuestionCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Унікальних користувачів"
                  value={new Set(results.map((r) => r.full_name)).size}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Level Distribution */}
          <Card title="Розподіл за рівнями знань" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              {Object.entries(statistics?.levelDistribution || {}).map(([level, count]) => (
                <Col xs={24} sm={12} md={8} lg={4} key={level}>
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="circle"
                      size={80}
                      percent={Math.round((count / (statistics?.totalTests || 1)) * 100)}
                      format={() => count}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Text strong>{level}</Text>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Questions Count by Block */}
          <Card title="Кількість питань по блоках">
            <Row gutter={[16, 16]}>
              {Object.entries(BLOCK_NAMES).map(([blockNum, blockName]) => (
                <Col xs={24} sm={12} md={8} lg={4} key={blockNum}>
                  <Card size="small">
                    <Statistic
                      title={`Блок ${blockNum}`}
                      value={questionsCount[Number.parseInt(blockNum)] || 0}
                      prefix={<QuestionCircleOutlined />}
                    />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {blockName}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Результати
            </span>
          }
          key="results"
        >
          <Card
            title="Результати тестування"
            extra={
              <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportResults}>
                Експорт в Excel
              </Button>
            }
          >
            <Table
              columns={resultsColumns}
              dataSource={results}
              rowKey="_id"
              scroll={{ x: 1200 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Всього ${total} записів`,
              }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <QuestionCircleOutlined />
              Питання
            </span>
          }
          key="questions"
        >
          <Card
            title="Керування питаннями"
            extra={
              <Space>
                <Button type="default" icon={<PlusOutlined />} onClick={handleCreateQuestion}>
                  Додати питання
                </Button>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => setImportModal(true)}
                >
                  Імпорт питань
                </Button>
              </Space>
            }
          >
            <Table
              columns={questionsColumns}
              dataSource={questions}
              rowKey="_id"
              scroll={{ x: 800 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Всього ${total} питань`,
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Text strong>Варіанти відповідей:</Text>
                        <ul style={{ marginTop: 8 }}>
                          {record.answers.map((answer, index) => (
                            <li key={index} style={{ marginBottom: 4 }}>
                              <Text
                                style={{
                                  color: record.correct.includes(index) ? '#52c41a' : 'inherit',
                                  fontWeight: record.correct.includes(index) ? 'bold' : 'normal',
                                }}
                              >
                                {record.correct.includes(index) && '✓ '}
                                {answer}
                              </Text>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {record.youtube_url && (
                        <div>
                          <Text strong>YouTube: </Text>
                          <Text copyable>{record.youtube_url}</Text>
                        </div>
                      )}
                      {record.image_path && (
                        <div>
                          <Text strong>Зображення: </Text>
                          <Text copyable>{record.image_path}</Text>
                        </div>
                      )}
                    </Space>
                  </div>
                ),
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Change Password Modal */}
      <Modal
        title="Зміна паролю"
        open={changePasswordModal}
        onCancel={() => setChangePasswordModal(false)}
        footer={null}
      >
        <Form form={changePasswordForm} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            name="oldPassword"
            label="Старий пароль"
            rules={[{ required: true, message: 'Введіть старий пароль' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Новий пароль"
            rules={[
              { required: true, message: 'Введіть новий пароль' },
              { min: 3, message: 'Пароль має бути не менше 3 символів' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setChangePasswordModal(false)}>Скасувати</Button>
              <Button type="primary" htmlType="submit">
                Зберегти
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Import Questions Modal */}
      <Modal
        title="Імпорт питань"
        open={importModal}
        onCancel={() => setImportModal(false)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text type="warning">
            <strong>Увага!</strong> Імпорт питань призведе до повного видалення всіх існуючих питань
            та їх заміни новими.
          </Text>
          <Upload accept=".json" beforeUpload={handleImportQuestions} showUploadList={false}>
            <Button icon={<UploadOutlined />} size="large" block>
              Вибрати JSON файл
            </Button>
          </Upload>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Файл має містити масив питань у форматі JSON згідно з технічним завданням.
          </Text>
        </Space>
      </Modal>

      {/* Question Form Drawer */}
      <Drawer
        title={editingQuestion ? 'Редагувати питання' : 'Додати нове питання'}
        placement="right"
        size="large"
        onClose={() => setQuestionFormDrawer(false)}
        open={questionFormDrawer}
        destroyOnClose={true}
      >
        <QuestionForm
          question={editingQuestion || undefined}
          onSubmit={handleQuestionSubmit}
          onCancel={() => setQuestionFormDrawer(false)}
          loading={formLoading}
        />
      </Drawer>
    </div>
  )
}
