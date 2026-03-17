import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api/client';

const ExpenseContext = createContext();
export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load expenses from API
  const loadExpenses = useCallback(async () => {
    if (!userProfile) return;
    setLoading(true);
    try {
      const data = await apiFetch('/expenses');
      setExpenses(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      console.error('Load expenses error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  // Load account members
  const loadMembers = useCallback(async () => {
    if (!userProfile) return;
    try {
      const data = await apiFetch('/members');
      setMembers(data);
    } catch (err) {
      console.error('Load members error:', err.message);
    }
  }, [userProfile]);

  // Load pending invites
  const loadInvites = useCallback(async () => {
    if (!userProfile) return;
    try {
      const data = await apiFetch('/invites');
      setPendingInvites(data);
    } catch (err) {
      console.warn('Load invites error:', err.message);
    }
  }, [userProfile]);

  useEffect(() => {
    loadExpenses();
    loadMembers();
    loadInvites();
  }, [loadExpenses, loadMembers, loadInvites]);

  const addExpense = async (expense) => {
    const newExpense = await apiFetch('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense)
    });
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  };

  const deleteExpense = async (id) => {
    await apiFetch(`/expenses/${id}`, { method: 'DELETE' });
    setExpenses(prev => prev.filter(e => e._id !== id));
  };

  const sendInvite = async (email) => {
    await apiFetch('/invites', { method: 'POST', body: JSON.stringify({ toEmail: email }) });
  };

  const acceptInvite = async (invite) => {
    const res = await apiFetch(`/invites/${invite._id}/accept`, { method: 'PATCH' });
    const updatedProfile = { ...userProfile, accountId: res.accountId };
    setUserProfile(updatedProfile);
    localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    setPendingInvites(prev => prev.filter(i => i._id !== invite._id));
    await Promise.all([loadExpenses(), loadMembers()]);
  };

  const declineInvite = async (invite) => {
    await apiFetch(`/invites/${invite._id}/decline`, { method: 'PATCH' });
    setPendingInvites(prev => prev.filter(i => i._id !== invite._id));
  };

  const login = async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('user_profile', JSON.stringify(data.user));
    setUserProfile(data.user);
    return data.user;
  };

  const updateProfile = async (updates) => {
    const data = await apiFetch('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    localStorage.setItem('user_profile', JSON.stringify(data));
    setUserProfile(data);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('user_profile', JSON.stringify(data.user));
    setUserProfile(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_profile');
    setUserProfile(null);
    setExpenses([]);
    setPendingInvites([]);
  };

  return (
    <ExpenseContext.Provider value={{
      userProfile, expenses, members, pendingInvites, loading,
      startingBalance: userProfile?.startingBalance || 0,
      addExpense, deleteExpense, sendInvite, acceptInvite, declineInvite,
      login, register, logout, loadExpenses, loadMembers, updateProfile
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
