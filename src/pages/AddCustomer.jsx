import React, { useEffect, useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import { Layout } from '../layouts/Layout'
import axios from 'axios';
import { toast, Toaster } from 'sonner';


const initialData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
}

export const AddCustomer = () => {
  const params = useParams();
  const [isUpdateModeEnabled, setIsUpdateModeEnabled] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    ...initialData
  })
  const [errors, setErrors] = useState()

  useEffect(() => {
    if (params?.id) {
      setIsUpdateModeEnabled(true)
      fetchCustomer()
    }
  }, [params])

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`http://localhost:5296/api/Customer/${params.id}`);
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

  // const renderToast = (errorMessage) => {
  //   return (
  //     toast.error(errorMessage)
  //   )
  // }

  const addCustomer = async () => {
    try {
      const response = await axios.post('http://localhost:5296/api/Customer', newCustomer);
      toast.success('Customer added successfully')
      console.log(response.data);
    } catch (error) {
      const errorData = error?.response?.data?.errors;
      console.log('Error: ', errorData);
      setErrors(errorData);
      if (errorData) showErrorToasts(errorData);
    }
  }

  const updateCustomer = async () => {
    try {
      const response = await axios.put(`http://localhost:5296/api/Customer/${params.id}`, newCustomer);
      toast.success('Customer updated successfully')
      console.log(response.data);
    } catch (error) {
      const errorData = error?.response?.data?.errors;
      console.log('Error: ', errorData);
      setErrors(errorData);
      if (errorData) showErrorToasts(errorData);
    }
  }

  const handleSubmit = () => {
    if (isUpdateModeEnabled) {
      updateCustomer()
    }
    else {
      addCustomer()
    }
  }

  const showErrorToasts = (errors) => {
    Object.entries(errors).forEach(([field, messages]) => {
      messages.forEach((message) => {
        toast.error(`${field}: ${message}`);
      });
    });
  };

  // function ErrorList({ errors }) {
  //   return (
  //     <div className='py-4'>
  //       <h6 className='mb-2'>Please resolve the following errors:</h6>
  //       <ul>
  //         {Object.entries(errors).map(([field, messages]) => (
  //           <li key={field}>
  //             <b>{field}:</b>
  //             <ul>
  //               {messages.map((message, index) => (
  //                 <li key={index} className='text-danger'>{message}</li>
  //               ))}
  //             </ul>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
  // }


  return (
    <Layout>
      <Toaster position='top-right' expand richColors />
      <Container>
        <h2 className='my-4'>
          {isUpdateModeEnabled ? 'Update' : 'Add'} Customer
        </h2>

        <Form className='w-50 shadow-sm rounded-3 p-4'>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control type='text' placeholder='Hanzala' name="firstName" value={newCustomer.firstName} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type='text' placeholder='Sultan' name="lastName" value={newCustomer.lastName} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" name="email" value={newCustomer.email} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="email" placeholder="+971123456789" name="phone" value={newCustomer.phone} onChange={handleInputChange} />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button onClick={handleSubmit} type='button'>{isUpdateModeEnabled ? 'Update' : 'Add'}</Button>
          </div>
        </Form>
        {/* {errors && <ErrorList errors={errors} />} */}
      </Container>
    </Layout>
  )
}
