import { FC, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import classnames from 'classnames'
import { Button, Checkbox, Form, Input } from 'antd'
import { fireErrorMessage, fireSuccessMessage } from 'utils/general'
import {
  getAuth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification
} from 'firebase/auth'
import './style.scss'

const Register: FC = () => {
  const auth = getAuth()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const formValidation = (values: any) => {
    // password confirmation
    if (values.password !== values['password-confirm']) {
      fireErrorMessage('Passwords do not match!')
      return false
    }

    if (!values.terms) {
      fireErrorMessage('You have to agree the terms!')
      return false
    }

    return true
  }

  const onFinish = async (values: any) => {
    console.log('Success:', values)

    if (!formValidation(values)) return

    setIsLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password)

      localStorage.setItem('userCredential', JSON.stringify(userCredential))
      console.log('userCredential', userCredential)

      await sendEmailVerification(userCredential.user).finally(() => setIsLoading(false))

      fireSuccessMessage('You have successfully registered! Please check your email to verify your account.')
    } catch (e) {
      console.error(e)

      fireErrorMessage('Unexpected error! Please check the form')
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.error('Failed:', errorInfo)

    fireErrorMessage('Please check the form!')
  }

  return (
    <main className="register-wrapper">
      <div style={{ display: 'none' }}>
        <input
          type="text"
          id="PreventChromeAutocomplete"
          name="PreventChromeAutocomplete"
          autoComplete="address-level4"
        />
      </div>
      <Row>
        <Col
          className="d-flex align-items-center justify-content-center auth-bg px-2 p-lg-5 login-left-column"
          sm="12"
        >
          <div className="register-left-column-content">
            <h1>Sign Up</h1>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="nope"
            >
              <Input.Group size="large">
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input your email!' }]}
                >
                  <Input
                    placeholder="Email"
                    autoComplete="off"
                    readOnly
                    onFocus={(e: any) => e.target.removeAttribute('readonly')}
                  />
                </Form.Item>
              </Input.Group>
              <Input.Group size="large">
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password
                    placeholder="Password"
                    autoComplete="off"
                  />
                </Form.Item>
              </Input.Group>
              <Input.Group size="large">
                <Form.Item
                  name="password-confirm"
                  rules={[{ required: true, message: 'Please input your password again!' }]}
                >
                  <Input.Password
                    placeholder="Confirm your password"
                    autoComplete="off"
                  />
                </Form.Item>
              </Input.Group>
              <Input.Group size="large">
                <Form.Item
                  name="terms"
                  valuePropName="checked"
                >
                  <Checkbox>I agree the terms</Checkbox>
                </Form.Item>
              </Input.Group>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isLoading}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <div className="links-area">
              <Link to="/login">Sign In</Link>
            </div>
          </div>
        </Col>
      </Row>
    </main>
  )
}

export default Register
