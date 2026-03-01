import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import styles from './LoginModal.module.css';

export default function LoginModal({ isOpen, onClose, onOpenSignup }) {
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email.trim(), password);
      authLogin(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 id="login-modal-title" className={styles.title}>Log in</h2>
        <p className={styles.subtitle}>Welcome back. Sign in to your account.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.field}>
            <label htmlFor="login-modal-email">Email</label>
            <input
              id="login-modal-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="login-modal-password">Password</label>
            <input
              id="login-modal-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in...' : 'Log in'}
          </button>

          <p className={styles.switch}>
            Don&apos;t have an account?{' '}
            <button type="button" className={styles.linkBtn} onClick={() => { onClose(); onOpenSignup?.(); }}>
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
