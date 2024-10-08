import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

export const AppNavBar = () => {
  return (
    <Navbar bg="secondary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">UHS | Customers Portal</Navbar.Brand>
          <Nav className="">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/customers/list">Customers</Nav.Link>
            <Nav.Link href="/customers/add">Add</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  )
}
