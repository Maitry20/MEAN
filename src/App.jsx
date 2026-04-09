import React, { useState } from 'react';
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
import InvestmentPlan from './pages/InvestmentPlan';
import SavingsGoal from './pages/SavingsGoal';
import MonthlyReport from './pages/MonthlyReport';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import InviteNotification from './components/InviteNotification';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
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

// Inner component that has access to the context
const AppRoutes = () => {
  const { userProfile } = useExpenses();
  const isAuthenticated = !!userProfile;

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
      <Route path="/" element={isAuthenticated ? <AppLayout><Dashboard /></AppLayout> : <Navigate to="/login" />} />
      <Route path="/add-expense" element={isAuthenticated ? <AppLayout><AddExpense /></AppLayout> : <Navigate to="/login" />} />
      <Route path="/history" element={isAuthenticated ? <AppLayout><ExpenseHistory /></AppLayout> : <Navigate to="/login" />} />
      <Route path="/members" element={isAuthenticated ? <AppLayout><Members /></AppLayout> : <Navigate to="/login" />} />
      <Route path="/investment-plan" element={isAuthenticated ? <AppLayout><InvestmentPlan /></AppLayout> : <Navigate to="/login" />} />
      <Route path="/savings-goal" element={isAuthenticated ? <AppLayout><SavingsGoal /></AppLayout> : <Navigate to="/login" />} />
      <Route path="/reports" element={isAuthenticated ? <AppLayout><MonthlyReport /></AppLayout> : <Navigate to="/login" />} />
      <Route path="/profile" element={isAuthenticated ? <AppLayout><Profile /></AppLayout> : <Navigate to="/login" />} />
    </Routes>
  );
};

const App = () => (
  <ExpenseProvider>
    <Router>
      <AppRoutes />
    </Router>
  </ExpenseProvider>
);

export default App;
