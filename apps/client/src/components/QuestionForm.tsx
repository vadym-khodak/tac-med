import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Form, Input, Select, Space, Typography } from 'antd'
import React, { useEffect } from 'react'
import { BLOCK_NAMES, Question } from '../types'

const { TextArea } = Input
const { Title, Text } = Typography

interface QuestionFormProps {
  question?: Question
  onSubmit: (values: Omit<Question, '_id'>) => void
  onCancel: () => void
  loading?: boolean
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (question) {
      form.setFieldsValue({
        ...question,
        correct: question.correct || [],
      })
    } else {
      // Set default values for new question
      form.setFieldsValue({
        block: 1,
        answers: ['', '', '', ''],
        correct: [],
        image_path: '',
        youtube_url: '',
      })
    }
  }, [question, form])

  const handleSubmit = (values: any) => {
    // Ensure correct is an array of numbers
    const correctIndices = Array.isArray(values.correct)
      ? values.correct.map((v: any) => (typeof v === 'number' ? v : Number.parseInt(v)))
      : []

    onSubmit({
      ...values,
      correct: correctIndices,
      answers: values.answers.filter((a: string) => a.trim() !== ''),
    })
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        block: 1,
        answers: ['', '', '', ''],
        correct: [],
        image_path: '',
        youtube_url: '',
      }}
    >
      <Title level={4} style={{ marginBottom: 24 }}>
        {question ? 'Редагувати питання' : 'Додати нове питання'}
      </Title>

      <Form.Item name="block" label="Блок" rules={[{ required: true, message: 'Оберіть блок' }]}>
        <Select>
          {Object.entries(BLOCK_NAMES).map(([key, value]) => (
            <Select.Option key={key} value={Number.parseInt(key)}>
              Блок {key}: {value}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="question"
        label="Питання"
        rules={[{ required: true, message: 'Введіть питання' }]}
      >
        <TextArea rows={3} placeholder="Введіть текст питання" />
      </Form.Item>

      <Card title="Варіанти відповідей" style={{ marginBottom: 24 }}>
        <Form.List name="answers">
          {(fields) => (
            <>
              {fields.map((field, index) => (
                <Space key={field.key} align="baseline" style={{ width: '100%', marginBottom: 16 }}>
                  <Form.Item
                    {...field}
                    label={`Відповідь ${index + 1}`}
                    rules={[{ required: true, message: 'Введіть відповідь' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Input placeholder={`Варіант відповіді ${index + 1}`} />
                  </Form.Item>
                  <Form.Item name="correct" valuePropName="checked" style={{ marginBottom: 0 }}>
                    <Checkbox
                      value={index}
                      onChange={(e) => {
                        const currentCorrect = form.getFieldValue('correct') || []
                        if (e.target.checked) {
                          form.setFieldsValue({
                            correct: [...currentCorrect, index],
                          })
                        } else {
                          form.setFieldsValue({
                            correct: currentCorrect.filter((i: number) => i !== index),
                          })
                        }
                      }}
                      checked={form.getFieldValue('correct')?.includes(index)}
                    >
                      Правильна
                    </Checkbox>
                  </Form.Item>
                </Space>
              ))}
              {fields.length < 4 && (
                <Button
                  type="dashed"
                  onClick={() => {
                    if (fields.length < 4) {
                      const answers = form.getFieldValue('answers')
                      form.setFieldsValue({
                        answers: [...answers, ''],
                      })
                    }
                  }}
                  icon={<PlusOutlined />}
                  style={{ width: '100%' }}
                >
                  Додати відповідь
                </Button>
              )}
            </>
          )}
        </Form.List>
        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          Відмітьте одну або декілька правильних відповідей
        </Text>
      </Card>

      <Card title="Медіа контент (необов'язково)" style={{ marginBottom: 24 }}>
        <Form.Item name="youtube_url" label="YouTube URL">
          <Input placeholder="https://www.youtube.com/watch?v=... або https://youtu.be/..." />
        </Form.Item>

        <Form.Item
          name="image_path"
          label="Шлях до зображення"
          help="YouTube відео має пріоритет над зображенням"
        >
          <Input placeholder="/images/example.jpg або https://example.com/image.jpg" />
        </Form.Item>
      </Card>

      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Скасувати</Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {question ? 'Оновити' : 'Додати'} питання
        </Button>
      </Space>
    </Form>
  )
}
