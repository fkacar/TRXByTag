import { FC, useState, useEffect } from 'react'
import { Row, Col } from 'reactstrap'
import { Link, useNavigate } from 'react-router-dom'
import classnames from 'classnames'
import { fireErrorMessage, fireToasterMessage } from 'utils/general'
import { Button, Checkbox, Form, Input } from 'antd'
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth'
import './style.scss'

const Login: FC = () => {
  const auth = getAuth()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onFinish = (values: any) => {
    console.log('Success:', values)

    setIsLoading(true)

    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((credentialUser: any) => {
        console.log('credentialUser', credentialUser)

        const accessToken = credentialUser.user.accessToken
        const refreshToken = credentialUser.user.stsTokenManager.refreshToken

        localStorage.setItem('trxAccessToken', accessToken)
        localStorage.setItem('trxRefreshToken', refreshToken)
        localStorage.setItem('trxUID', credentialUser.uid)

        fireToasterMessage('You have successfully logged in! Welcome back!')
        navigate('/')
      })
      .catch((err: any) => {
        console.error(err)

        fireErrorMessage('Unexpected error! Please check the form')
      })
      .finally(() => setIsLoading(false))
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)

    fireErrorMessage('Unexpected error! Please check the form')
  }

  return (
    <main className="login-wrapper">
      <Row>
        <Col
          className="d-flex align-items-center justify-content-center auth-bg px-2 p-lg-5 login-left-column"
          sm="12"
        >
          <div className="login-left-column-content">
            <h1>Sign In</h1>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Input.Group size="large">
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input your email!' }]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
              </Input.Group>
              <Input.Group size="large">
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>
              </Input.Group>
              <Input.Group size="large">
                <Form.Item
                  name="remember"
                  valuePropName="checked"
                >
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
              </Input.Group>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={isLoading}
                  block
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <div className="links-area">
              <Link to="/sign-up">Sign Up</Link>
            </div>
          </div>
        </Col>
      </Row>
    </main>
  )
}

export default Login
