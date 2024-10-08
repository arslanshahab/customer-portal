import React, { useEffect, useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import { Layout } from '../layouts/Layout'
import { toast, Toaster } from 'sonner';
import { httpService } from '../services/httpService';
import { useDispatch, useSelector } from 'react-redux';
import { addCustomer, emptyErrors, updateCustomer } from '../redux/slices/customerSlice';

const initialData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
}

export const AddCustomer = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { errors: _errors } = useSelector((state) => state.customers);

  const [isUpdateModeEnabled, setIsUpdateModeEnabled] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    ...initialData
  })
  const [errors, setErrors] = useState()

  useEffect(() => {
    if (params?.id) {
      setIsUpdateModeEnabled(true)
      fetchCustomer()
    } else {
      setNewCustomer({ ...initialData })
      setIsUpdateModeEnabled(false)
    }
  }, [params])

  useEffect(() => {
    if (_errors) {
      showErrorToasts(_errors)
    }
  }, [_errors])

  const fetchCustomer = async () => {
    try {
      const response = await httpService.get(`/customer/${params.id}`);
      setNewCustomer(response.data)
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  const handleInputChange = ({ currentTarget: input }) => {
    if (errors) {
      setErrors(null)
    }
    const updatedCustomer = { ...newCustomer };
    updatedCustomer[input.name] = input.value;
    setNewCustomer(updatedCustomer)
  }


  const handleSubmit = async () => {
    if (isUpdateModeEnabled) {
      dispatch(updateCustomer(newCustomer))
    }
    else {
      dispatch(addCustomer(newCustomer))
    }
  }

  const showErrorToasts = (errors) => {
    Object.entries(errors).forEach(([field, messages]) => {
      messages.forEach((message) => {
        toast.error(`${field}: ${message}`);
      });
    });
    dispatch(emptyErrors());
  };


  return (
    <Layout>
      <Toaster position='top-right' expand richColors />
      <Container>
        <h2 className='my-4'>
          {isUpdateModeEnabled ? 'Update' : 'Add'} Customer
        </h2>

        <Form className='w-50 shadow-sm rounded-3 p-4 bg-white'>
          <Form.Group className="mb-3">
            <Form.Label className='fw-medium'>First Name</Form.Label>
            <Form.Control type='text' placeholder='Hanzala' name="firstName" value={newCustomer.firstName} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className='fw-medium'>Last Name</Form.Label>
            <Form.Control type='text' placeholder='Sultan' name="lastName" value={newCustomer.lastName} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className='fw-medium'>Email address</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" name="email" value={newCustomer.email} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className='fw-medium'>Phone Number</Form.Label>
            <Form.Control type="email" placeholder="+971123456789" name="phone" value={newCustomer.phone} onChange={handleInputChange} />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button onClick={handleSubmit} type='button' variant='warning'>{isUpdateModeEnabled ? 'Update Customer' : 'Add Customer'}</Button>
          </div>
        </Form>
      </Container>
    </Layout>
  )
}
