import React, { useState } from 'react';
import { Card, Input, Button, Typography, Space, message, Form } from 'antd';
import { LockOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';

const { Title, Text } = Typography;

export const AdminLogin: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { password: string }) => {
    try {
      setLoading(true);
      const { token } = await adminApi.login(values.password);
      
      // Store token in localStorage
      localStorage.setItem('adminToken', token);
      
      message.success('Успішний вхід');
      navigate('/admin/dashboard');
    } catch (error: any) {
      message.error('Невірний пароль');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <LockOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
          <Title level={3} style={{ color: '#1f2937', marginBottom: 8 }}>
            Вхід адміністратора
          </Title>
          <Text type="secondary">
            Введіть пароль для доступу до панелі адміністратора
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
        >
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Введіть пароль' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Пароль"
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
              loading={loading}
              style={{ 
                borderRadius: '8px',
                height: '48px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Увійти
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToMenu}
          >
            Повернутися до головного меню
          </Button>
        </div>

        <div style={{ marginTop: 24, padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <strong>Примітка:</strong> Пароль за замовчуванням: 12345
          </Text>
        </div>
      </Card>
    </div>
  );
};