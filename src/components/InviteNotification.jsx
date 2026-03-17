import React from 'react';
import { Mail, Check, X } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useExpenses } from '../context/ExpenseContext';

const InviteNotification = () => {
  const { pendingInvites, acceptInvite, declineInvite } = useExpenses();

  if (!pendingInvites || pendingInvites.length === 0) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      {pendingInvites.map((invite) => (
        <Card key={invite._id} style={{ 
          backgroundColor: 'var(--primary)', 
          color: 'white',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '1.5rem 2rem',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
          animation: 'slideDown 0.5s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <Mail size={28} color="white" />
            </div>
            <div>
              <p style={{ margin: '0 0 0.25rem 0', fontWeight: 700, fontSize: '1.1rem' }}>You've been invited!</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                <strong>{invite.fromName || invite.fromEmail}</strong> invited you to share their expenses.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => declineInvite(invite)}
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                border: '1px solid rgba(255, 255, 255, 0.3)', 
                color: 'white',
                padding: '0.6rem 1.2rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              <X size={18} /> Decline
            </button>
            <button 
              onClick={() => acceptInvite(invite)}
              style={{ 
                background: 'white', 
                border: 'none', 
                color: 'var(--primary)',
                padding: '0.6rem 1.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Check size={18} /> Accept Invitation
            </button>
          </div>
        </Card>
      ))}
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default InviteNotification;
