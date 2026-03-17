import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';

const categoryOptions = [
  'Food & Dining', 'Travel & Commute', 'Shopping', 'Bills & Utilities',
  'Entertainment', 'Salary', 'Investment', 'Health', 'Education', 'Other'
];

const AddExpense = () => {
  const { addExpense, userProfile, loading: profileLoading } = useExpenses();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Food & Dining',
    amount: '',
    type: 'debited'
  });

  // Show a non-blocking notice if profile isn't loaded yet
  const profileReady = !!userProfile?.accountId;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    setIsSubmitting(true);
    try {
      await addExpense(formData);
      navigate('/');
    } catch (err) {
      console.error('Add expense error:', err);
      alert('Failed to add expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.75rem' }}>Add Transaction</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Record a new income or expense</p>
      </div>

      <div style={{ 
        background: 'var(--card-bg)', 
        borderRadius: '16px', 
        padding: '2rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)'
      }}>
        <form onSubmit={handleSubmit}>
          {/* Date */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                border: '1.5px solid var(--border-color)', background: 'var(--input-bg)',
                color: 'var(--text-primary)', fontSize: '1rem', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What was this for?"
              required
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                border: '1.5px solid var(--border-color)', background: 'var(--input-bg)',
                color: 'var(--text-primary)', fontSize: '1rem', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                border: '1.5px solid var(--border-color)', background: 'var(--input-bg)',
                color: 'var(--text-primary)', fontSize: '1rem', boxSizing: 'border-box'
              }}
            >
              {categoryOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                border: '1.5px solid var(--border-color)', background: 'var(--input-bg)',
                color: 'var(--text-primary)', fontSize: '1rem', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Type */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Transaction Type
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['debited', 'credited'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: t }))}
                  style={{
                    flex: 1, padding: '0.75rem', borderRadius: '10px', fontSize: '1rem',
                    fontWeight: 600, cursor: 'pointer', border: '2px solid',
                    borderColor: formData.type === t
                      ? (t === 'debited' ? '#ef4444' : '#10b981')
                      : 'var(--border-color)',
                    background: formData.type === t
                      ? (t === 'debited' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)')
                      : 'transparent',
                    color: formData.type === t
                      ? (t === 'debited' ? '#ef4444' : '#10b981')
                      : 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}
                >
                  {t === 'debited' ? '↑ Debited' : '↓ Credited'}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                flex: 1, padding: '0.875rem', borderRadius: '10px', fontSize: '1rem',
                fontWeight: 600, cursor: 'pointer', border: '1.5px solid var(--border-color)',
                background: 'transparent', color: 'var(--text-primary)'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !profileReady}
              style={{
                flex: 2, padding: '0.875rem', borderRadius: '10px', fontSize: '1rem',
                fontWeight: 600, cursor: (isSubmitting || !profileReady) ? 'not-allowed' : 'pointer',
                background: 'var(--primary)', color: 'white', border: 'none',
                opacity: (isSubmitting || !profileReady) ? 0.6 : 1, transition: 'opacity 0.2s'
              }}
            >
              {!profileReady ? 'Loading account...' : isSubmitting ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
