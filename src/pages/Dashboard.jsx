import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const MetricCard = ({ label, value, color, icon, onClick, style }) => (
  <div 
    onClick={onClick}
    style={{
      background: 'var(--card-bg)', borderRadius: '16px', padding: '1.5rem',
      display: 'flex', alignItems: 'center', gap: '1rem',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      border: onClick ? `2px dashed ${color}30` : '2px solid transparent',
      ...style
    }}
    onMouseEnter={e => {
      if (onClick) {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = `0 15px 30px ${color}20`;
        e.currentTarget.style.borderColor = color;
      }
    }}
    onMouseLeave={e => {
      if (onClick) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
        e.currentTarget.style.borderColor = `${color}30`;
      }
    }}
  >
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
      background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.5rem',
      transition: 'transform 0.3s ease'
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
        {onClick && <span style={{ marginLeft: '0.5rem', opacity: 0.5 }}>✎</span>}
      </p>
      <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {value}
      </h2>
    </div>
  </div>
);

const fmt = (n) => `₹${(Number(n) || 0).toFixed(2)}`;

const Dashboard = () => {
  const { expenses, loading, startingBalance, userProfile, updateProfile } = useExpenses();
  const navigate = useNavigate();

  const handleUpdateGoal = () => {
    navigate('/savings-goal');
  };

  const handleUpdateInvestment = () => {
    navigate('/investment-plan');
  };

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const thisMonth = expenses.filter(exp => {
    if (!exp.date) return false;
    const d = new Date(exp.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const totalDebited = thisMonth
    .filter(e => e.type === 'debited')
    .reduce((s, e) => s + (Number(e.amount) || 0), 0);

  const totalCredited = thisMonth
    .filter(e => e.type === 'credited')
    .reduce((s, e) => s + (Number(e.amount) || 0), 0);

  const monthStart = Number(startingBalance) || 0;
  const monthClose = monthStart + totalCredited - totalDebited;
  
  const savingsGoal = userProfile?.savingsGoal || 0;
  const investmentAmount = userProfile?.investmentPlan?.amount || 0;
  const investmentDay = userProfile?.investmentPlan?.dayOfMonth || 1;

  // Pie chart data
  const catMap = thisMonth
    .filter(e => e.type === 'debited')
    .reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + (Number(e.amount) || 0);
      return acc;
    }, {});
  const pieData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  // Bar chart data (last 6 months)
  const barData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const m = d.getMonth(), y = d.getFullYear();
    const total = expenses
      .filter(e => {
        if (!e.date) return false;
        const ed = new Date(e.date);
        return ed.getMonth() === m && ed.getFullYear() === y && e.type === 'debited';
      })
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);
    barData.push({ name: MONTH_NAMES[m], amount: total });
  }

  const getCategoryEmoji = (cat) => {
    const map = { 'Food & Dining': '🍽️', 'Travel & Commute': '🚗', 'Shopping': '🛍️', 'Bills & Utilities': '💡', 'Entertainment': '🎬', 'Salary': '💰', 'Investment': '📈', 'Health': '❤️', 'Education': '📚', 'Other': '📌' };
    return map[cat] || '💳';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.75rem' }}>
            Dashboard {loading && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>• Syncing...</span>}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            {MONTH_NAMES[month]} {year} overview {userProfile ? `• ${userProfile.name || userProfile.email}` : ''}
          </p>
        </div>
        <Link to="/add-expense" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'var(--primary)', color: 'white', border: 'none',
            borderRadius: '12px', padding: '0.75rem 1.5rem', fontSize: '1rem',
            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            + Add Expense
          </button>
        </Link>
      </div>

      {/* Primary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <MetricCard label="Prev Month Close" value={fmt(userProfile?.previousMonthClose || 0)} color="#64748b" icon="⏮️" />
        <MetricCard label="Month Start" value={fmt(monthStart)} color="#3b82f6" icon="📊" />
        <MetricCard label="Monthly Expense" value={fmt(totalDebited)} color="#ef4444" icon="↑" />
        <MetricCard label="Amount Credited" value={fmt(totalCredited)} color="#10b981" icon="↓" />
        <MetricCard label="Month Close" value={fmt(monthClose)} color="#8b5cf6" icon="📅" />
        <MetricCard 
          label="Savings Goal" 
          value={savingsGoal > 0 ? fmt(savingsGoal) : 'Set Goal'} 
          color="#f59e0b" 
          icon="🎯" 
          onClick={handleUpdateGoal}
        />
        <MetricCard 
          label="Monthly Investment" 
          value={investmentAmount > 0 ? `${fmt(investmentAmount)} (Day ${investmentDay})` : 'Set Plan'} 
          color="#06b6d4" 
          icon="📈" 
          onClick={handleUpdateInvestment}
        />
      </div>


      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <ExpensePieChart data={pieData} />
        <MonthlyBarChart data={barData} />
      </div>

      {/* Recent Transactions */}
      <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0 }}>Recent Transactions <span style={{ fontSize: '0.75rem', background: 'rgba(59,130,246,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '1rem', marginLeft: '0.5rem' }}>{expenses.length}</span></h3>
          <Link to="/history" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary)' }}>View all →</Link>
        </div>

        {expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ margin: 0, fontSize: '1rem' }}>No transactions yet. Click "+" to add your first one!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {expenses.slice(0, 6).map(exp => (
              <div key={exp.id} style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem',
                borderRadius: '10px', background: 'var(--bg-color)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                  background: exp.type === 'debited' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  {getCategoryEmoji(exp.category)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 0.1rem 0', fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exp.description}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{exp.category} • {exp.date}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ margin: '0 0 0.1rem 0', fontWeight: 700, fontSize: '1rem', color: exp.type === 'debited' ? '#ef4444' : '#10b981' }}>
                    {exp.type === 'debited' ? '-' : '+'}{fmt(exp.amount)}
                  </p>
                  <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '1rem', background: exp.type === 'debited' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: exp.type === 'debited' ? '#ef4444' : '#10b981', fontWeight: 500 }}>
                    {exp.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
