import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, UserPlus, Mail, Clock, CheckCircle } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

const Members = () => {
  const { members, sendInvite, loading } = useExpenses();
  const [inviteEmail, setInviteEmail] = useState('');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--text-secondary)' }}>
        Loading members...
      </div>
    );
  }

  const handleInvite = (e) => {
    e.preventDefault();
    if (inviteEmail.trim()) {
      sendInvite(inviteEmail);
      setInviteEmail('');
      alert(`Invitation sent to ${inviteEmail}! They will see it when they log in.`);
      
      // Mailto link for user convenience
      const subject = "Join my Expense Tracker account";
      const body = `Hi! I've invited you to share my expense tracker account. Log in to the app to accept the request.`;
      window.location.href = `mailto:${inviteEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.75rem' }}>Account Members</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Manage people sharing this account</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Invite Member Form */}
        <Card style={{ alignSelf: 'start' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={20} color="var(--primary)" />
            Invite via Email
          </h3>
          <form onSubmit={handleInvite}>
            <Input 
              id="inviteEmail"
              label="Collaborator Email"
              type="email"
              placeholder="friend@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
            <Button type="submit" style={{ width: '100%', marginTop: '1.5rem' }}>
              Send Invitation
            </Button>
          </form>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            After sending, you can click the mail link to send them a personal message.
          </p>
        </Card>

        {/* Members List */}
        <Card>
          <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--primary)" />
            Current & Pending Members
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {members.map((member) => (
              <div 
                key={member.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-color)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  opacity: member.status === 'invited' ? 0.7 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    width: '40px', height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: member.status === 'invited' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {member.status === 'invited' ? <Clock size={20} color="#f59e0b" /> : <User size={20} color="var(--primary)" />}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{member.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {member.status === 'invited' ? 'Waiting for acceptance...' : member.email}
                    </p>
                  </div>
                </div>
                {member.status !== 'invited' && (
                  <CheckCircle size={18} color="var(--success)" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Members;
