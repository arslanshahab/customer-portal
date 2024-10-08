import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { BASE_API_URL } from '../constants';
import { httpService } from '../services/httpService';


export const ViewCustomerModal = ({ show, customerId, onModalClose }) => {
  const [customer, setCustomer] = useState()

  useEffect(() => {
    if (customerId) {
      fetchCustomer()
    }
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      const response = await httpService.get(`/customer/${customerId}`);
      setCustomer(response.data)
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  return (
    <Modal show={show} onHide={onModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Customer Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>First Name:</strong> {customer?.firstName}</p>
        <p><strong>Last Name:</strong> {customer?.lastName}</p>
        <p><strong>Email:</strong> {customer?.email}</p>
        <p><strong>Phone:</strong> {customer?.phone}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
