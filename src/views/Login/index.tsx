import { FC, useState, useEffect } from 'react'
import { Row, Col } from 'reactstrap'
import classnames from 'classnames'
import { Button, Checkbox, Form, Input } from 'antd'
import './style.scss'

const Login: FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
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
                  name="username"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input />
                </Form.Item>
              </Input.Group>
              <Input.Group size="large">
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password />
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
                  block
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </main>
  )
}

export default Login
