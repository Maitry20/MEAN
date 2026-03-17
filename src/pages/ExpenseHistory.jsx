import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Filter, Edit2, Trash2 } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

const categories = [
  { value: 'All', label: 'All Categories' },
  { value: 'Food', label: 'Food & Dining' },
  { value: 'Travel', label: 'Travel & Commute' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Bills', label: 'Bills & Utilities' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Salary', label: 'Salary' },
  { value: 'Investment', label: 'Investment' },
  { value: 'Other', label: 'Other' }
];

const ExpenseHistory = () => {
  const { expenses, members, deleteExpense } = useExpenses(); // Added deleteExpense if needed later
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  const filteredExpenses = expenses.filter(exp => {
    const matchCategory = filterCategory === 'All' || exp.category === filterCategory;
    const matchDate = filterDate === '' || exp.date === filterDate;
    return matchCategory && matchDate;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.75rem' }}>Expense History</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>View and manage all your transactions</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Filter size={16} color="var(--text-secondary)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Filters</span>
          </div>
          <Input 
            id="filter-category"
            type="select"
            options={categories}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ minWidth: '150px' }}
          />
          <Input 
            id="filter-date"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ minWidth: '150px' }}
          />
          {(filterCategory !== 'All' || filterDate !== '') && (
            <Button variant="outline" onClick={() => { setFilterCategory('All'); setFilterDate(''); }} style={{ padding: '0.5rem 1rem' }}>
              Clear
            </Button>
          )}
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Member</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Type</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => {
                  const member = members.find(m => m.id === expense.memberId);
                  const memberName = member ? member.name : 'Unknown';
                  
                  return (
                    <tr key={expense.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="table-row">
                      <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>{new Date(expense.date).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{expense.description}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-secondary)', 
                          backgroundColor: 'var(--bg-color)', 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '9999px',
                          border: '1px solid var(--border-color)'
                        }}>
                          {expense.category}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{memberName}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: expense.type === 'credited' ? 'var(--success)' : 'var(--danger)',
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}>
                          {expense.type}
                        </span>
                      </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: expense.type === 'credited' ? 'var(--success)' : 'inherit' }}>
                      {expense.type === 'credited' ? '+' : '-'}${expense.amount.toFixed(2)}
                    </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '0.25rem' }}
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => deleteExpense && deleteExpense(expense.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '0.25rem' }}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No expenses found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <style>{`
        .table-row:hover {
          background-color: var(--bg-color);
        }
        .table-row:last-child {
          border-bottom: none !important;
        }
      `}</style>
    </div>
  );
};

export default ExpenseHistory;
