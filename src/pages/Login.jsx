import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Wallet } from 'lucide-react';

import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      console.error('Login error', err);
      setError('Invalid email or password. Please try again.');
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Enter your details to access your account</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: 600 }}>Create an account</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
