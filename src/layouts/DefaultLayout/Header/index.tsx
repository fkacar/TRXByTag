import React from 'react'
import { Col, Row, Container } from 'reactstrap'
import headerNavbarItems from 'constants/header-navbar-items'

const HeaderComponent = () => {
  return (
    <main className="header-wrapper">
      <Container>
        <Row>
          <Col xs={4}>
            <strong>TRXByTag</strong>
          </Col>
          <Col xs={8}>
            <section className="navbar-section d-flex">
              {headerNavbarItems.map(item => (
                <div
                  key={`navbar_item_${item.key}`}
                  className="navbar-item"
                >
                  {item.name}
                </div>
              ))}
            </section>
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default HeaderComponent
