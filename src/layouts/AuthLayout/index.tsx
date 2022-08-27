import { FC, ReactNode, ReactElement } from 'react'
import { Row, Col, Container } from 'reactstrap'
import SideBar from './SideBar'

export interface DefaultLayoutProps {
  children: ReactNode | ReactElement
}

const AuthLayout: FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <>
      <main className="auth-layout-wrapper">
        <Container fluid>
          <Row>
            <Col xs={7}>
              <Container>{children}</Container>
            </Col>
            <Col
              xs={5}
              className="p-0"
            >
              <SideBar />
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}

export default AuthLayout
