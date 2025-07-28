import { ClockCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  Modal,
  Progress,
  Radio,
  Space,
  Spin,
  Typography,
  message,
} from 'antd'
import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { questionsApi, resultsApi } from '../services/api'
import { BLOCK_NAMES, Question, TestAnswer } from '../types'

const { Title, Text, Paragraph } = Typography

export const TestInterface: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [fullName, setFullName] = useState<string>('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<TestAnswer[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [answerSaved, setAnswerSaved] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(20 * 60) // 20 minutes in seconds
  const [showInstructions, setShowInstructions] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get fullName from navigation state or redirect to main menu
    const { fullName: nameFromState } = location.state || {}
    if (!nameFromState) {
      navigate('/')
      return
    }
    setFullName(nameFromState)
  }, [location, navigate])

  useEffect(() => {
    if (fullName && showInstructions) {
      loadQuestions()
    }
  }, [fullName, showInstructions])

  useEffect(() => {
    if (!showInstructions && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            submitTest()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [showInstructions, timeRemaining])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const data = await questionsApi.getTestSet()
      setQuestions(data.questions)

      // Initialize answers array
      const initialAnswers: TestAnswer[] = data.questions.map((question) => ({
        question_id: question._id,
        selected_answers: [],
      }))
      setAnswers(initialAnswers)
    } catch (_error) {
      message.error('Помилка завантаження питань')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleStartTest = () => {
    setShowInstructions(false)
  }

  const handleAnswerChange = (selectedIndices: number[]) => {
    setSelectedAnswers(selectedIndices)
  }

  const handleSaveAnswer = () => {
    const updatedAnswers = [...answers]
    updatedAnswers[currentQuestionIndex].selected_answers = selectedAnswers
    setAnswers(updatedAnswers)
    setAnswerSaved(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswers([])
      setAnswerSaved(false)
    } else {
      submitTest()
    }
  }

  const submitTest = useCallback(async () => {
    try {
      const result = await resultsApi.submitTest(fullName, answers)
      navigate('/results', { state: { result, fullName } })
    } catch (_error) {
      message.error('Помилка збереження результатів')
    }
  }, [fullName, answers, navigate])

  const handleWindowClose = (e: BeforeUnloadEvent) => {
    if (!showInstructions) {
      e.preventDefault()
      e.returnValue =
        'Тестування не завершено. Результати не будуть збережені. Ви впевнені, що хочете вийти?'
    }
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleWindowClose)
    return () => window.removeEventListener('beforeunload', handleWindowClose)
  }, [showInstructions])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + (answerSaved ? 1 : 0)) / questions.length) * 100

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    )
  }

  if (showInstructions) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <Card style={{ maxWidth: 600, width: '100%' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
            Тестування Вашого рівня теоретичних знань по навичкам тактичної медицині
          </Title>

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Paragraph>
              <Text strong>Тест включає в себе 6 блоків по 10 питань в кожному блоці.</Text>
            </Paragraph>

            <Paragraph>
              <Text strong>Час на проходження тесту – 20 хвилин.</Text>
            </Paragraph>

            <Paragraph>
              Після закінчення часу тест буде завершено, правильні відповіді збережуться.
            </Paragraph>

            <div>
              <Text strong>Блоки питань:</Text>
              <ol style={{ marginTop: 8 }}>
                <li>Загальні питання</li>
                <li>Масивна кровотеча (Massive Hemorrhage)</li>
                <li>Дихальні шляхи (Airway)</li>
                <li>Дихання (Respiration)</li>
                <li>Кровообіг (Circulation)</li>
                <li>Гіпотермія/травма голови (Hypothermia/Head Injury)</li>
              </ol>
            </div>

            <Paragraph>
              Необхідно надати максимальну кількість правильних відповідей на всі поставлені
              запитання у визначений час.
            </Paragraph>

            <Paragraph>
              <Text type="warning">
                В питаннях де правильних відповідей декілька – відповідь зараховується, якщо
                правильних відповідей більше половини (60%).
              </Text>
            </Paragraph>

            <Button
              type="primary"
              size="large"
              block
              onClick={handleStartTest}
              style={{ marginTop: 24 }}
            >
              Розпочати тестування
            </Button>
          </Space>
        </Card>
      </div>
    )
  }

  if (!currentQuestion) {
    return null
  }

  const isMultipleChoice = currentQuestion.correct.length > 1

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      {/* Timer */}
      <Card style={{ marginBottom: 16, textAlign: 'center' }}>
        <Space size="large">
          <div>
            <ClockCircleOutlined
              style={{ fontSize: '24px', color: timeRemaining < 300 ? '#ff4d4f' : '#52c41a' }}
            />
            <Text
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginLeft: 8,
                color: timeRemaining < 300 ? '#ff4d4f' : 'inherit',
              }}
            >
              {formatTime(timeRemaining)}
            </Text>
          </div>
          <div>
            <QuestionCircleOutlined style={{ fontSize: '24px' }} />
            <Text style={{ fontSize: '20px', fontWeight: 'bold', marginLeft: 8 }}>
              Питання {currentQuestionIndex + 1} з {questions.length}
            </Text>
          </div>
        </Space>
        <Progress percent={progress} status="active" style={{ marginTop: 16 }} />
      </Card>

      {/* Question */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Блок {currentQuestion.block}:{' '}
            {BLOCK_NAMES[currentQuestion.block as keyof typeof BLOCK_NAMES]}
          </Text>
        </div>

        {/* Media content */}
        {currentQuestion.youtube_url && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <iframe
              width="100%"
              height="315"
              src={(() => {
                const url = currentQuestion.youtube_url
                // Handle different YouTube URL formats
                if (url.includes('youtube.com/watch?v=')) {
                  const videoId = url.split('v=')[1].split('&')[0]
                  return `https://www.youtube.com/embed/${videoId}`
                }
                if (url.includes('youtu.be/')) {
                  const videoId = url.split('youtu.be/')[1].split('?')[0]
                  return `https://www.youtube.com/embed/${videoId}`
                }
                if (url.includes('youtube.com/embed/')) {
                  return url
                }
                return url
              })()}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {currentQuestion.image_path && !currentQuestion.youtube_url && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <img
              src={currentQuestion.image_path}
              alt="Question"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        )}

        <Title level={4} style={{ marginBottom: 24 }}>
          {currentQuestion.question}
        </Title>

        {isMultipleChoice ? (
          <Checkbox.Group
            value={selectedAnswers}
            onChange={handleAnswerChange}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {currentQuestion.answers.map((answer, index) => (
                <Checkbox
                  key={index}
                  value={index}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    backgroundColor: answerSaved
                      ? currentQuestion.correct.includes(index)
                        ? '#f6ffed'
                        : selectedAnswers.includes(index) &&
                            !currentQuestion.correct.includes(index)
                          ? '#fff2f0'
                          : 'white'
                      : 'white',
                    borderColor: answerSaved
                      ? currentQuestion.correct.includes(index)
                        ? '#52c41a'
                        : selectedAnswers.includes(index) &&
                            !currentQuestion.correct.includes(index)
                          ? '#ff4d4f'
                          : '#d9d9d9'
                      : '#d9d9d9',
                  }}
                  disabled={answerSaved}
                >
                  {answer}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        ) : (
          <Radio.Group
            value={selectedAnswers[0]}
            onChange={(e) => handleAnswerChange([e.target.value])}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {currentQuestion.answers.map((answer, index) => (
                <Radio
                  key={index}
                  value={index}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    backgroundColor: answerSaved
                      ? currentQuestion.correct.includes(index)
                        ? '#f6ffed'
                        : selectedAnswers.includes(index) &&
                            !currentQuestion.correct.includes(index)
                          ? '#fff2f0'
                          : 'white'
                      : 'white',
                    borderColor: answerSaved
                      ? currentQuestion.correct.includes(index)
                        ? '#52c41a'
                        : selectedAnswers.includes(index) &&
                            !currentQuestion.correct.includes(index)
                          ? '#ff4d4f'
                          : '#d9d9d9'
                      : '#d9d9d9',
                  }}
                  disabled={answerSaved}
                >
                  {answer}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              onClick={handleSaveAnswer}
              disabled={selectedAnswers.length === 0 || answerSaved}
            >
              Зберегти відповідь
            </Button>
            <Button
              type="default"
              size="large"
              onClick={handleNextQuestion}
              disabled={!answerSaved}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Наступне питання' : 'Завершити тест'}
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  )
}
