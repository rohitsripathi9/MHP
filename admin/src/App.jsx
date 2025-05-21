import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Order from './pages/Order/Order'
import List from './pages/List/List'
import Add from './pages/Add/Add'
import Login from './pages/Login/Login'
import Feedback from './pages/Feedback/Feedback'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const url = "http://localhost:4000"
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token && window.location.pathname !== '/login') {
      navigate('/login');
    }
  }, [navigate]);

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const AdminLayout = ({ children }) => (
    <div>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        {children}
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/login"
          element={
            localStorage.getItem('adminToken') ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Add url={url} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Add url={url} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/list"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <List url={url} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Order url={url} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Feedback url={url} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;