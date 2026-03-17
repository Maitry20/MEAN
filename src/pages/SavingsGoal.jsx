import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Target, ArrowLeft, Save, ShieldCheck } from 'lucide-react';

const SavingsGoal = () => {
  const { userProfile, updateProfile } = useExpenses();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [amount, setAmount] = useState(userProfile?.savingsGoal || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        savingsGoal: parseFloat(amount)
      });
      alert('Savings goal updated successfully! This amount will be automatically debited at the start of every month.');
      navigate('/');
    } catch (err) {
      alert('Failed to update goal: ' + err.message);
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
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>Monthly Savings Goal</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Set aside a fixed amount for your future every month</p>
      </div>

      <Card style={{ padding: '2.5rem' }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '16px', 
          backgroundColor: 'rgba(245, 158, 11, 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          <Target size={32} color="#f59e0b" />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input 
            label="Monthly Savings Target (₹)"
            type="number"
            placeholder="10000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
          />

          <div style={{ 
            backgroundColor: 'rgba(16, 185, 129, 0.05)', 
            padding: '1.25rem', 
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.1)',
            fontSize: '0.875rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#10b981' }}>
              <ShieldCheck size={18} />
              <p style={{ margin: 0, fontWeight: 600 }}>Automatic Commitment</p>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li>The target amount will be debited on the <strong>1st of every month</strong>.</li>
              <li>This helps you treat savings as a non-negotiable expense.</li>
              <li>You can view these debits in your history under 'Other' category.</li>
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
            {loading ? 'Saving...' : <><Save size={20} /> Set Savings Goal</>}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SavingsGoal;
