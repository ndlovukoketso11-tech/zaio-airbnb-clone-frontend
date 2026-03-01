import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/api';
import styles from './SignupModal.module.css';

export default function SignupModal({ isOpen, onClose, onOpenLogin }) {
  const { login: authLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = await register(username.trim(), email.trim(), password, 'user');
      authLogin(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSwitchToLogin = () => {
    onClose();
    onOpenLogin();
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="signup-modal-title">
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 id="signup-modal-title" className={styles.title}>Sign up</h2>
        <p className={styles.subtitle}>Create an account to book stays and save your favourites.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.field}>
            <label htmlFor="signup-modal-name">Name</label>
            <input
              id="signup-modal-name"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="signup-modal-email">Email</label>
            <input
              id="signup-modal-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="signup-modal-password">Password</label>
            <input
              id="signup-modal-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="signup-modal-confirm">Confirm password</label>
            <input
              id="signup-modal-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <p className={styles.switch}>
            Already have an account?{' '}
            <button type="button" className={styles.linkBtn} onClick={handleSwitchToLogin}>
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
