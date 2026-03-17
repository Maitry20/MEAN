import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { TrendingUp, Calendar, ArrowLeft, Save } from 'lucide-react';

const InvestmentPlan = () => {
  const { userProfile, updateProfile } = useExpenses();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: userProfile?.investmentPlan?.amount || 0,
    dayOfMonth: userProfile?.investmentPlan?.dayOfMonth || 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        investmentPlan: {
          amount: parseFloat(formData.amount),
          dayOfMonth: parseInt(formData.dayOfMonth)
        }
      });
      alert('Investment plan updated successfully! The system will now automatically debit this amount monthly.');
      navigate('/');
    } catch (err) {
      alert('Failed to update plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-secondary)', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          fontSize: '0.9rem'
        }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>Investment Planning</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Set up automatic monthly investment deductions</p>
      </div>

      <Card style={{ padding: '2.5rem' }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '16px', 
          backgroundColor: 'rgba(6, 182, 212, 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          <TrendingUp size={32} color="#06b6d4" />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input 
            label="Monthly Investment Amount (₹)"
            type="number"
            placeholder="5000"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            required
            min="0"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Debit Day of Month (1-28)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <Input 
                  type="number"
                  placeholder="10"
                  value={formData.dayOfMonth}
                  onChange={(e) => setFormData({...formData, dayOfMonth: e.target.value})}
                  required
                  min="1"
                  max="28"
                />
              </div>
              <div style={{ 
                flex: 2, 
                backgroundColor: 'var(--bg-secondary)', 
                padding: '1rem', 
                borderRadius: '12px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}>
                <Calendar size={14} style={{ marginBottom: '0.25rem' }} />
                <br />
                Amount will be debited on the <strong>{formData.dayOfMonth || '...'}th</strong> of every month.
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'rgba(59, 130, 246, 0.05)', 
            padding: '1.25rem', 
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            fontSize: '0.875rem'
          }}>
            <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
              How it works?
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li>The system checks your plan once a day.</li>
              <li>If today is the scheduled day (or past it), and we haven't debited this month, a new entry is created.</li>
              <li>It appears automatically in your transaction history.</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '1rem',
              height: '50px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}
          >
            {loading ? 'Saving...' : <><Save size={20} /> Save Investment Plan</>}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default InvestmentPlan;
