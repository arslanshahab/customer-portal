import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const AppNavBar = () => {
  return (
    <Navbar bg="warning">
        <Container>
          <Navbar.Brand as={Link} to="/">UHS | Customers Portal</Navbar.Brand>
          <Nav className="">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/customers/list">Customers</Nav.Link>
            <Nav.Link as={Link} to="/customers/add">Add</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  )
}
