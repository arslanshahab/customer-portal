import React from 'react'
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';


export const DeleteConfirmModal = ({ show, onDeleteConfirm, onModalClose }) => {

  return (
    <Modal show={show} onHide={onModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this record?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onModalClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDeleteConfirm}>
          Yes, delete
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
