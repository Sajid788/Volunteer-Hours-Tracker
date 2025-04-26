import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Organizations from './pages/Organizations';
import OrganizationDetail from './pages/OrganizationDetail';
import CreateOrganization from './pages/CreateOrganization';
import SubmitHours from './pages/SubmitHours';

function App() {
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = (userData, userToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setUser(userData);
    setToken(userToken);
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    toast.info('You have been logged out');
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} logout={logout} />
        <main className="container mx-auto px-4 py-6 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login login={login} /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register login={login} /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} token={token} toast={toast} /> : <Navigate to="/login" />} />
            <Route path="/organizations" element={<Organizations user={user} token={token} toast={toast} />} />
            <Route path="/organizations/:id" element={<OrganizationDetail user={user} token={token} toast={toast} />} />
            <Route path="/create-organization" element={user && (user.role === 'organization' || user.role === 'admin') ? <CreateOrganization user={user} token={token} toast={toast} /> : <Navigate to="/login" />} />
            <Route path="/submit-hours" element={user ? <SubmitHours user={user} token={token} toast={toast} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white text-center py-4">
          <p>&copy; {new Date().getFullYear()} Volunteer Hours Tracker</p>
        </footer>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App; 