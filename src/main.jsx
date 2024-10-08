import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CustomerList } from './pages/CustomerList.jsx';
import { AddCustomer } from './pages/AddCustomer.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerList />
  },
  {
    path: '/customers/list',
    element: <CustomerList />
  },
  {
    path: '/customers/add',
    element: <AddCustomer />
  },
  {
    path: '/customers/add/:id',
    element: <AddCustomer />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <Toaster />
        <App />
      </RouterProvider>
    </Provider>
  </StrictMode>,
)
