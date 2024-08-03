import './App.css';
import React, { useState } from 'react';
import Index from './components/Index';
import Login from './components/Login';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar'; // Import your admin navbar component
import Signup from './components/Signup';
import Alert from './components/Alert';
import Profile from './components/Profile';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import Admin from './components/Admin';

function App() {
  const [alert, setAlert] = useState(null);
  
  const showAlert = (type, message) => {
    setAlert({
      type: type,
      message: message
    });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  }

  return (
    <>
      <Alert alert={alert} />
      <Routes>
        <Route exact path="/" element={<Index showAlert={showAlert} />} />
        <Route exact path="/login" element={<Login showAlert={showAlert} />} />
        <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />
        <Route exact path="/profile" element={<Profile showAlert={showAlert} />} />
        <Route exact path="/adminlogin" element={<AdminLogin showAlert={showAlert} />} />
        <Route exact path="/admin" element={<Admin showAlert={showAlert} />} />
      </Routes>
    </>
  );
}

function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      { !isAdminRoute && <Navbar /> } {/* // Render the regular navbar if not on admin route */}
      { isAdminRoute && <AdminNavbar /> } {/* // Render the admin navbar if on admin route */}
      <App />
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default AppWrapper;
