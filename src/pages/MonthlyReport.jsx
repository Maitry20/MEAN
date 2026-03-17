import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Calendar, TrendingUp, TrendingDown, Wallet, Target, TrendingUp as InvestmentIcon } from 'lucide-react';

const MonthlyReport = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiFetch('/reports/monthly');
        setSummaries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const fmt = (num) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num || 0);

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ color: 'var(--error)', textAlign: 'center', marginTop: '2rem' }}>Error: {error}</div>;

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>Monthly Performance Reports</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>A historical snapshot of your finances at the end of each month</p>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={thStyle}><Calendar size={16} /> Month</th>
                <th style={thStyle}>⏮️ Prev Month Close</th>
                <th style={thStyle}>📊 Month Start</th>
                <th style={thStyle}>↑ Monthly Expense</th>
                <th style={thStyle}>↓ Amount Credited</th>
                <th style={thStyle}>📅 Month Close</th>
                <th style={thStyle}>🎯 Savings Goal</th>
                <th style={thStyle}>📈 Investment</th>
              </tr>
            </thead>
            <tbody>
              {summaries.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No historical data available yet. Reports are generated at the start of every new month.
                  </td>
                </tr>
              ) : (
                summaries.map((s) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 600 }}>{formatMonth(s.month)}</span>
                    </td>
                    <td style={tdStyle}>{fmt(s.previousMonthClose || 0)}</td>
                    <td style={tdStyle}>{fmt(s.startingBalance)}</td>
                    <td style={{ ...tdStyle, color: '#ef4444' }}>{fmt(s.totalDebited)}</td>
                    <td style={{ ...tdStyle, color: '#10b981' }}>{fmt(s.totalCredited)}</td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#8b5cf6' }}>{fmt(s.closingBalance)}</td>
                    <td style={tdStyle}>{fmt(s.savingsGoal)}</td>
                    <td style={tdStyle}>{fmt(s.investmentAmount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div style={{ marginTop: '1.5rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        💡 <strong>Note:</strong> Carryover Amount is the final balance that was added as a credit to your next month's budget.
      </div>
    </div>
  );
};

const thStyle = {
  padding: '1.25rem 1.5rem',
  textAlign: 'left',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  whiteSpace: 'nowrap',
  gap: '0.5rem',
  display: 'table-cell' // Using table-cell because display: flex on th breaks alignment
};

const tdStyle = {
  padding: '1.25rem 1.5rem',
  fontSize: '0.925rem',
  color: 'var(--text-primary)',
  whiteSpace: 'nowrap'
};

const formatMonth = (monthStr) => {
  const [year, month] = monthStr.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

export default MonthlyReport;
