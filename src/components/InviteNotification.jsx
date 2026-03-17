import React from 'react';
import { Mail, Check, X } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useExpenses } from '../context/ExpenseContext';

const InviteNotification = () => {
  const { pendingInvites, acceptInvite, declineInvite } = useExpenses();

  if (pendingInvites.length === 0) return null;

  return (
    <div style={{ padding: '1rem', marginBottom: '2rem' }}>
      {pendingInvites.map((invite) => (
        <Card key={invite.id} style={{ 
          backgroundColor: 'rgba(59, 130, 246, 0.05)', 
          border: '1px solid var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <Mail size={20} color="var(--primary)" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>Account Sharing Invitation</p>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <strong>{invite.fromName}</strong> ({invite.fromEmail}) invited you to share their account.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => declineInvite(invite)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <X size={16} /> Decline
            </Button>
            <Button size="sm" onClick={() => acceptInvite(invite)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Check size={16} /> Accept & Switch Account
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default InviteNotification;
