import React, { useEffect, useRef, useState } from 'react'
import { Layout } from '../layouts/Layout'
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Container } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../redux/slices/customerSlice';

const PAGINATION_SIZE = 3;
const BASE_URL = "http://localhost:5296";

export const CustomerList = () => {
  const dispatch = useDispatch();
  // const { customers, loading, error } = useSelector((state) => state.customers);


  const [customers, setCustomers] = useState([]);
  const [isFetching, setIsFetching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    fetchCustomers()
  }, [currentPage, searchQuery])

  // useEffect(() => {
  //   dispatch(fetchCustomers({ page: currentPage, search: searchQuery }));
  // }, [dispatch, currentPage, searchQuery]);

  async function fetchCustomers() {
    try {
      setIsFetching(true)
      const { data } = await axios.get(`${BASE_URL}/api/Customer?page=${currentPage}&pageSize=${PAGINATION_SIZE}&search=${searchQuery}`)
      setCustomers(data?.customers);
      setTotalPages(data?.totalPages)
    } catch (error) {
      console.log("ERROR: ", error);
    } finally {
      setIsFetching(false)
    }
  }

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

  return (
    <Layout>
      <Container>
        <h2 className='my-4'>Customers List</h2>
        <div className="d-flex justify-content-end align-items-center gap-4 mb-4">
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
                      </tr>
                    )
                  }
                </tbody>
              </Table>
              <Pagination>{renderPagination()}</Pagination>
            </>
          )}
      </Container>
    </Layout>
  )
}
