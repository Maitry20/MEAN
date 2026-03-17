import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import ExpenseHistory from './pages/ExpenseHistory';
import Members from './pages/Members';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { ExpenseProvider } from './context/ExpenseContext';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

import InviteNotification from './components/InviteNotification';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div className="main-content">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="content-area">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <InviteNotification />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
        <div className="loader">Loading Account...</div>
      </div>
    );
  }

  const isAuthenticated = !!user;

  return (
    <ExpenseProvider>
      <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

          
          <Route path="/" element={
            isAuthenticated ? (
              <AppLayout>
                <Dashboard />
              </AppLayout>
            ) : <Navigate to="/login" />
          } />
          
          <Route path="/add-expense" element={
            isAuthenticated ? (
              <AppLayout>
                <AddExpense />
              </AppLayout>
            ) : <Navigate to="/login" />
          } />
          
          <Route path="/history" element={
            isAuthenticated ? (
              <AppLayout>
                <ExpenseHistory />
              </AppLayout>
            ) : <Navigate to="/login" />
          } />
          
          <Route path="/members" element={
            isAuthenticated ? (
              <AppLayout>
                <Members />
              </AppLayout>
            ) : <Navigate to="/login" />
          } />

          <Route path="/profile" element={
            isAuthenticated ? (
              <AppLayout>
                <Profile />
              </AppLayout>
            ) : <Navigate to="/login" />
          } />
        </Routes>
      </Router>
    </ExpenseProvider>
  );
};

export default App;
