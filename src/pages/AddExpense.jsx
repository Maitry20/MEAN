import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';

const categories = [
  { value: 'Food', label: 'Food & Dining' },
  { value: 'Travel', label: 'Travel & Commute' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Bills', label: 'Bills & Utilities' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Salary', label: 'Salary' },
  { value: 'Investment', label: 'Investment' },
  { value: 'Other', label: 'Other' }
];

const transactionTypes = [
  { value: 'debited', label: 'Debited' },
  { value: 'credited', label: 'Credited' }
];

const AddExpense = () => {
  const { addExpense, members, loading } = useExpenses();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'debited',
    memberId: ''
  });

  // Set default member once members are loaded
  React.useEffect(() => {
    if (members.length > 0 && !formData.memberId) {
      setFormData(prev => ({ ...prev, memberId: members[0].id }));
    }
  }, [members, formData.memberId]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading members...</div>;
  }

  const memberOptions = members
    .filter(m => m.status !== 'invited') // Only show accepted members
    .map(m => ({ value: m.id, label: m.name }));


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const entry = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    addExpense(entry);
    alert('Transaction added successfully!');
    navigate('/');
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.75rem' }}>Add Expense</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Record a new transaction</p>
      </div>

      <Card style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <Input 
              id="amount" 
              label="Amount ($)" 
              type="number" 
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required 
            />
            <Input 
              id="category" 
              label="Category" 
              type="select" 
              options={categories}
              value={formData.category}
              onChange={handleChange}
              required 
            />
            <Input 
              id="type" 
              label="Type" 
              type="select" 
              options={transactionTypes}
              value={formData.type}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <Input 
              id="date" 
              label="Date" 
              type="date"
              value={formData.date}
              onChange={handleChange}
              required 
            />
            <Input 
              id="memberId" 
              label="Member" 
              type="select" 
              options={memberOptions}
              value={formData.memberId}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <Input 
              id="description" 
              label="Description" 
              type="text" 
              placeholder="What was this for?"
              value={formData.description}
              onChange={handleChange}
              required 
            />
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <Button type="button" variant="outline" style={{ flex: 1 }} onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" style={{ flex: 2 }}>
              Save Expense
            </Button>
          </div>
        </form>
      </Card>
      
      <style>{`
        @media (max-width: 600px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AddExpense;
