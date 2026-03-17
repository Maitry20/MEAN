import React from 'react';
import { Utensils, ShoppingBag, Car, FileText, Film, DollarSign, User } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

const categoryIcons = {
  Food: <Utensils size={20} color="var(--warning)" />,
  Shopping: <ShoppingBag size={20} color="var(--primary)" />,
  Travel: <Car size={20} color="var(--success)" />,
  Bills: <FileText size={20} color="var(--danger)" />,
  Entertainment: <Film size={20} color="#8b5cf6" />
};

const getCategoryColor = (category) => {
  switch (category) {
    case 'Food': return { bg: 'rgba(245, 158, 11, 0.1)', icon: 'var(--warning)' };
    case 'Shopping': return { bg: 'rgba(59, 130, 246, 0.1)', icon: 'var(--primary)' };
    case 'Travel': return { bg: 'rgba(16, 185, 129, 0.1)', icon: 'var(--success)' };
    case 'Bills': return { bg: 'rgba(239, 68, 68, 0.1)', icon: 'var(--danger)' };
    case 'Entertainment': return { bg: 'rgba(139, 92, 246, 0.1)', icon: '#8b5cf6' };
    default: return { bg: 'rgba(100, 116, 139, 0.1)', icon: 'var(--text-secondary)' };
  }
};

const ExpenseCard = ({ expense, hideDate = false }) => {
  const { members } = useExpenses();
  const { bg, icon } = getCategoryColor(expense.category);
  const iconComponent = categoryIcons[expense.category] || <DollarSign size={20} color={icon} />;
  
  const member = members.find(m => m.id === expense.memberId);
  const memberName = member ? member.name : 'Unknown';

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)', gap: '1rem' }}>
      <div style={{ 
        width: '48px', height: '48px', 
        borderRadius: '12px', 
        backgroundColor: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {iconComponent}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{expense.description}</h4>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
            {memberName}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-color)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
            {expense.category}
          </span>
          {!hideDate && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(expense.date).toLocaleDateString()}</span>}
        </div>
      </div>
      
      <div style={{ 
        fontWeight: 600, 
        fontSize: '1.125rem', 
        color: expense.type === 'credited' ? 'var(--success)' : 'var(--text-primary)' 
      }}>
        {expense.type === 'credited' ? '+' : '-'}${expense.amount.toFixed(2)}
      </div>
    </div>
  );
};

export default ExpenseCard;
