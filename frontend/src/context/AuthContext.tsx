import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 1,
    email: 'admin@example.com',
    full_name: 'Father Joseph Thomas',
    role: 'super_admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    phone: '+91 98765-43210'
  });

  const [role, setRoleState] = useState<UserRole>('super_admin');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    // Check localStorage token
    const token = localStorage.getItem('parish_token');
    const savedUser = localStorage.getItem('parish_user');
    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRoleState(parsed.role || 'super_admin');
      } catch (e) {}
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem('parish_user', JSON.stringify(updated));
    }
    showToast(`Switched active role to ${newRole.replace('_', ' ').toUpperCase()}`, 'info');
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem('parish_token', token);
    localStorage.setItem('parish_user', JSON.stringify(userData));
    setUser(userData);
    setRoleState(userData.role);
    showToast(`Welcome back, ${userData.full_name}!`, 'success');
  };

  const logout = () => {
    localStorage.removeItem('parish_token');
    localStorage.removeItem('parish_user');
    setUser(null);
    setRoleState('viewer');
    showToast('Logged out successfully', 'info');
  };

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setRole,
        login,
        logout,
        isAuthenticated: !!user,
        toastMessage,
        showToast
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl bg-slate-900 text-white border border-slate-700 animate-slide-up">
          <span className={`w-3 h-3 rounded-full ${toastMessage.type === 'success' ? 'bg-emerald-400' : toastMessage.type === 'error' ? 'bg-rose-500' : 'bg-teal-400'}`} />
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
