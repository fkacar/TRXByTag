import { FC, ReactNode, ReactElement } from 'react'
import { Row, Col, Container } from 'reactstrap'
import SideBar from './SideBar'

export interface DefaultLayoutProps {
  children: ReactNode | ReactElement
}

const AuthLayout: FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <>
      <Container>
        <Row>
          <Col xs={7}>{children}</Col>
          <Col xs={5}>
            <SideBar />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AuthLayout
