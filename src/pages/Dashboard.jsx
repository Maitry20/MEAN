import React, { useState } from 'react';
import Card from '../components/ui/Card';
import ExpenseCard from '../components/ExpenseCard';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import { TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';

const Dashboard = () => {
  const { expenses, loading, startingBalance = 0 } = useExpenses();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--text-secondary)' }}>
        Loading data...
      </div>
    );
  }

  // Calculate totals for the current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalDebited = currentMonthExpenses
    .filter(exp => exp.type === 'debited')
    .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  const totalCredited = currentMonthExpenses
    .filter(exp => exp.type === 'credited')
    .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  const closingBalance = (Number(startingBalance) || 0) + totalCredited - totalDebited;
  const remainingAmount = totalCredited - totalDebited;

  // Prepare Pie Chart Data
  const categoriesMap = currentMonthExpenses
    .filter(exp => exp.type === 'debited')
    .reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

  const categoryData = Object.keys(categoriesMap).map(name => ({
    name,
    value: categoriesMap[name]
  }));

  // Prepare Bar Chart Data (Last 6 months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const m = d.getMonth();
    const y = d.getFullYear();
    
    const monthlyTotal = expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === m && expDate.getFullYear() === y && exp.type === 'debited';
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    last6Months.push({ name: monthNames[m], amount: monthlyTotal });
  }

  const percentageChange = 0; // Simplified

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.75rem' }}>Dashboard</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Welcome back! Here's your financial overview for {monthNames[currentMonth]} {currentYear}.</p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
            <DollarSign size={24} color="var(--primary)" />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 500 }}>Month Record</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>${closingBalance.toFixed(2)}</h2>
          </div>
        </Card>

        <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
            <TrendingUp size={24} color="var(--danger)" />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 500 }}>Monthly expense</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>${totalDebited.toFixed(2)}</h2>
          </div>
        </Card>

        <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <ArrowDownRight size={24} color="var(--success)" />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 500 }}>Monthly credited</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>${totalCredited.toFixed(2)}</h2>
          </div>
        </Card>

        <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
            <TrendingUp size={24} color="#8b5cf6" />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 500 }}>Remaining amount</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>${remainingAmount.toFixed(2)}</h2>
          </div>
        </Card>

        {/* Add Expense Card */}
        <Link to="/add-expense" style={{ textDecoration: 'none' }}>
          <Card style={{ 
            padding: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.75rem', 
            height: '100%',
            backgroundColor: 'var(--primary)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            color: 'white'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <PlusCircle size={24} color="white" />
            <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Add Expense</h3>
          </Card>
        </Link>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <ExpensePieChart data={categoryData} />
        <MonthlyBarChart data={last6Months} />
      </div>

      {/* Recent Expenses List */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Recent Expenses</h3>
          <Link to="/history" style={{ fontSize: '0.875rem', fontWeight: 500 }}>View All</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {expenses.slice(0, 5).map(expense => (
            <ExpenseCard key={expense.id} expense={expense} />
          ))}
        </div>
      </Card>
      
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
