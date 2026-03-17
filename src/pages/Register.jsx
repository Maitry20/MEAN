import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Wallet } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

const Register = () => {
  const { register } = useExpenses();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)' }}>
      <Card style={{ maxWidth: '400px', width: '100%', margin: '1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', marginBottom: '1rem' }}>
            <Wallet size={32} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Start tracking your expenses today</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input 
            id="name" 
            label="Full Name" 
            type="text" 
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required 
            style={{ marginBottom: '1rem' }}
          />
          <Input 
            id="email" 
            label="Email Address" 
            type="email" 
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required 
            style={{ marginBottom: '1rem' }}
          />
          <Input 
            id="password" 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required 
            style={{ marginBottom: '1.5rem' }}
          />
          
          <Button fullWidth type="submit" disabled={loading} style={{ padding: '0.875rem' }}>
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
