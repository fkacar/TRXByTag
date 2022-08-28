import React from 'react'
import { Col, Row, Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import headerNavbarItems from 'constants/header-navbar-items'
import './style.scss'

const HeaderComponent = () => {
  return (
    <main className="header-wrapper">
      <Container>
        <Row>
          <Col xs={4}>
            <div className="logo">TRXByTag</div>
          </Col>
          <Col xs={8}>
            <section className="navbar-section d-flex">
              {headerNavbarItems.map(item => (
                <Link
                  key={`navbar_item_${item.key}`}
                  className="navbar-item"
                  to={item.path}
                >
                  {item.name}
                </Link>
              ))}
            </section>
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default HeaderComponent
