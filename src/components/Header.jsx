import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import styles from './Header.module.css';

import logoAsset from '../../assets/Logo.svg';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  const isAdminPage = location.pathname.startsWith('/admin');
  const isHome = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    if (isAdminPage) {
      navigate('/admin/login');
    } else {
      navigate('/');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img src={logoAsset} alt="Airbnb" className={styles.logoImg} />
        </Link>

        {!isAdminPage && (
          <nav className={styles.centerNav}>
            <NavLink to="/" className={({ isActive }) => `${styles.centerNavLink} ${isActive ? styles.centerNavActive : ''}`} end>
              Homes
            </NavLink>
            <span className={styles.centerNavLink}>
              Experiences
              <span className={styles.newTag}>NEW</span>
            </span>
            <span className={styles.centerNavLink}>
              Services
              <span className={styles.newTag}>NEW</span>
            </span>
          </nav>
        )}

        <nav className={styles.nav}>
          {isAdminPage ? (
            <>
              <Link to="/admin" className={styles.navLink}>
                Dashboard
              </Link>
              <Link to="/admin/listings" className={styles.navLink}>
                Listings
              </Link>
              <Link to="/admin/listings/new" className={styles.navLink}>
                Add listing
              </Link>
            </>
          ) : (
            <div className={styles.navRight}>
              <Link to="/admin" className={styles.navLink}>
                Become a host
              </Link>
            </div>
          )}

          <div className={styles.profileWrap}>
            {user ? (
              <>
                <button
                  type="button"
                  className={styles.profileBtn}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                >
                  <span className={styles.greeting}>Hi, {user.username}</span>
                  <span className={styles.menuIcon}>▼</span>
                </button>
                {dropdownOpen && (
                  <>
                    <div
                      className={styles.backdrop}
                      onClick={() => setDropdownOpen(false)}
                      aria-hidden="true"
                    />
                    <div className={styles.dropdown}>
                      {user.role === 'host' && (
                        <Link
                          to="/admin/reservations"
                          className={styles.dropdownItem}
                          onClick={() => setDropdownOpen(false)}
                        >
                          View reservations
                        </Link>
                      )}
                      <button
                        type="button"
                        className={styles.dropdownItem}
                        onClick={handleLogout}
                      >
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                type="button"
                className={styles.profileBtn}
                onClick={() => setLoginModalOpen(true)}
              >
                Log in
              </button>
            )}
          </div>
        </nav>
      </div>
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onOpenSignup={() => setSignupModalOpen(true)}
      />
      <SignupModal
        isOpen={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
        onOpenLogin={() => setLoginModalOpen(true)}
      />
    </header>
  );
}
