import { DashboardOutlined, LogoutOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { useAuth0 } from '@auth0/auth0-react'
import { Avatar, Dropdown, Layout, Menu, MenuProps, Space, Typography, theme } from 'antd'
import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const items = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: 'admin',
    icon: <UserOutlined />,
    label: 'Admin',
    children: [
      {
        key: '/admin/users',
        icon: <TeamOutlined />,
        label: 'Users',
      },
    ],
  },
]

export const AppLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const { token } = theme.useToken()
  const { logout, user: authUser } = useAuth0()

  const user = {
    email: authUser?.email || 'user@example.com',
    avatar: authUser?.picture || null,
  }

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  }

  const userMenuItems: MenuProps = {
    items: [
      {
        key: 'email',
        label: <Text style={{ padding: '0 8px' }}>{user.email}</Text>,
        disabled: true,
      },
      {
        type: 'divider',
      },
      {
        key: 'theme',
        icon: <ThemeToggle />,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        style={{
          borderRight: `1px solid ${token.colorBorder}`,
          background: token.colorBgContainer,
        }}
      >
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={items}
          onClick={handleMenuClick}
          style={{
            marginTop: '8px',
            background: token.colorBgContainer,
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '16px',
            borderBottom: `1px solid ${token.colorBorder}`,
          }}
        >
          <Dropdown menu={userMenuItems} trigger={['click']} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar size="large" icon={<UserOutlined />} src={user.avatar} />
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
