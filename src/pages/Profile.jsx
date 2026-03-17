import { useExpenses } from '../context/ExpenseContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { User, Shield, Bell, LogOut } from 'lucide-react';

const Profile = () => {
  const { userProfile, logout } = useExpenses();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // User data from Context
  const user = {
    name: userProfile?.name || 'User',
    email: userProfile?.email || 'No email provided',
    role: 'Account Owner',
    joined: userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'March 2026'
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.75rem' }}>User Profile</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Manage your account settings and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Profile Info */}
        <Card style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(59, 130, 246, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            border: '4px solid var(--bg-secondary)'
          }}>
            <User size={48} color="var(--primary)" />
          </div>
          <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem' }}>{user.name}</h2>
          <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-secondary)' }}>{user.email}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ 
              backgroundColor: 'rgba(59, 130, 246, 0.1)', 
              color: 'var(--primary)', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {user.role}
            </span>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Member since {user.joined}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            style={{ marginTop: '1rem', width: '100%' }}
            onClick={() => navigate('/')}
          >
            Manage Goals on Dashboard
          </Button>
        </Card>

        {/* Account Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color="var(--primary)" />
              Security
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Button variant="outline" style={{ justifyContent: 'flex-start', width: '100%' }}>
                Change Password
              </Button>
              <Button variant="outline" style={{ justifyContent: 'flex-start', width: '100%' }}>
                Two-Factor Authentication
              </Button>
            </div>
          </Card>

          <Card>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={20} color="var(--primary)" />
              Notifications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.875rem' }}>Email Notifications</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.875rem' }}>Push Notifications</span>
                <input type="checkbox" />
              </label>
            </div>
          </Card>

          <Button 
            variant="outline" 
            style={{ 
              color: 'var(--danger)', 
              borderColor: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout from all devices
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
