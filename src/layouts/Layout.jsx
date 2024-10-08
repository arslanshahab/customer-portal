import React from 'react'
import { Container } from 'react-bootstrap'
import { AppNavBar } from '../components/AppNavBar'

export const Layout = ({ children }) => {
  return (
    <Container fluid>
      <AppNavBar />
      {children}
    </Container>
  )
}
