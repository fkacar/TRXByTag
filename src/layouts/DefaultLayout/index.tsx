import { FC, ReactNode, ReactElement } from 'react'
import { Row, Col, Container } from 'reactstrap'
import HeaderComponent from './Header'

export interface DefaultLayoutProps {
  children: ReactNode | ReactElement
}

const DefaultLayout: FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <>
      <HeaderComponent />
      <Container>{children}</Container>
      <footer className="footer">Made With Love</footer>
    </>
  )
}

export default DefaultLayout
