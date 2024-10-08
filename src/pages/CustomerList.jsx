import React, { useEffect, useRef, useState } from 'react'
import { Layout } from '../layouts/Layout'
import Table from 'react-bootstrap/Table';
import { Button, Container } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCustomer, fetchCustomers } from '../redux/slices/customerSlice';
import { FaEye, FaPencil, FaTrash } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { ViewCustomerModal } from '../components/ViewCustomerModal';


export const CustomerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customers, loading, error, totalPages } = useSelector((state) => state.customers);

  const [isFetching, setIsFetching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeCustomerId, setActiveCustomerId] = useState(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCustomers({ page: currentPage, search: searchQuery }));
  }, [dispatch, currentPage, searchQuery]);


  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const renderPagination = () => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePaginationClick(number)}>
          {number}
        </Pagination.Item>,
      );
    }

    return items;
  }

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // debouncing -> move to separate file later
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500);
  }

  const handleViewClick = (id) => {
    setActiveCustomerId(id);
    setShowViewModal(true);
  }

  const handleEditClick = (id) => {
    navigate(`/customers/add/${id}`);
  }

  const handleDeleteClick = (id) => {
    setActiveCustomerId(id);
    setShowDeleteModal(true);
  }

  const handleUserDeleteConfirm = () => {
    dispatch(deleteCustomer(activeCustomerId));
    setShowDeleteModal(false);
  }

  const hideDeleteModal = () => {
    setShowDeleteModal(false);
  }

  const hideViewModal = () => {
    setShowViewModal(false);
  }


  return (
    <Layout>
      <Container>
        <h2 className='my-4'>Customers List</h2>
        <div className="d-flex justify-content-between align-items-center gap-4 mb-4">
          <Button onClick={() => navigate('/customers/add')} variant='warning'>Add Customer</Button>
          <Form className='d-inline-block'>
            <Form.Control type="text" placeholder="Search..." onChange={handleSearchChange} value={searchInput} />
          </Form>
        </div>
        {isFetching ?
          (
            <div className='d-flex justify-content-center align-items-center h-50'>
              <Spinner animation="border" />
            </div>
          )
          :
          (
            <>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    customers.map((customer) =>
                      <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>{customer.firstName}</td>
                        <td>{customer.lastName}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>
                          <div className='d-flex gap-2'>
                            <FaEye className='text-secondary' cursor={'pointer'} fontSize={14} onClick={
                              () => handleViewClick(customer.id)}
                            />
                            <FaTrash className='text-danger' cursor={'pointer'} fontSize={14} onClick={
                              () => handleDeleteClick(customer.id)
                            } />
                            <FaPencil className='text-info' cursor={'pointer'} fontSize={14} onClick={
                              () => handleEditClick(customer.id)
                            } />
                          </div>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </Table>
              {totalPages > 1 &&
                <Pagination size='sm'>{renderPagination()}</Pagination>
              }
            </>
          )}
        <DeleteConfirmModal show={showDeleteModal} onDeleteConfirm={handleUserDeleteConfirm} onModalClose={hideDeleteModal} />
        <ViewCustomerModal show={showViewModal} customerId={activeCustomerId} onModalClose={hideViewModal} />
      </Container>
    </Layout>
  )
}
