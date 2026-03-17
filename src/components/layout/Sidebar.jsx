import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, Settings, LogOut, UserCircle, Users, PieChart, Info } from 'lucide-react';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const navItems = [
    { name: 'Profile', path: '/profile', icon: <UserCircle size={20} /> },
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Account Members', path: '/members', icon: <Users size={20} /> },
    { name: 'Add Expense', path: '/add-expense', icon: <PlusCircle size={20} /> },
    { name: 'History', path: '/history', icon: <List size={20} /> },
  ];

  return (
    <>
      <aside style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        height: 'calc(100vh - var(--navbar-height))',
        position: 'fixed',
        left: isOpen ? 0 : 'calc(var(--sidebar-width) * -1)',
        top: 'var(--navbar-height)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'left 0.3s ease',
        zIndex: 9
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: isActive ? 'white' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'all 0.2s ease'
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.style.backgroundColor || e.currentTarget.style.backgroundColor === 'transparent') {
                  e.currentTarget.style.backgroundColor = 'var(--bg-color)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (e.currentTarget.style.backgroundColor === 'var(--bg-color)') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: 'var(--danger)',
              textDecoration: 'none',
              fontWeight: 500,
              background: 'none',
              border: 'none',
              width: '100%',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 'var(--navbar-height)',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 8,
          }}
          className="sidebar-overlay"
        />
      )}
      <style>{`
        @media (min-width: 769px) {
          aside { left: 0 !important; }
          .sidebar-overlay { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
