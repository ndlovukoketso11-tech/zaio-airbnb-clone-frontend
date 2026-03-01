import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getAccommodations,
  getReservationsByHost,
} from '../../services/api';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    myListings: 0,
    reservations: 0,
    revenue: 0,
  });
  const [recentReservations, setRecentReservations] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [accommodations, hostReservations] = await Promise.all([
          getAccommodations(),
          getReservationsByHost().catch(() => []),
        ]);

        if (cancelled) return;

        const myListings = accommodations.filter(
          (a) => a.host_id === user?.id || a.host_id === user?._id
        ).length;
        const revenue = (hostReservations || []).reduce((sum, r) => sum + (r.total || 0), 0);
        const recent = (hostReservations || []).slice(0, 8);

        setStats({
          myListings,
          reservations: (hostReservations || []).length,
          revenue,
        });
        setRecentReservations(recent);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load dashboard.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [user?.id, user?._id]);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '-');

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.subtitle}>Overview of your listings and reservations</p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>My listings</span>
          <span className={styles.cardValue}>{stats.myListings}</span>
          <Link to="/admin/listings" className={styles.cardLink}>
            Manage listings →
          </Link>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Reservations</span>
          <span className={styles.cardValue}>{stats.reservations}</span>
          <Link to="/admin/reservations" className={styles.cardLink}>
            View all →
          </Link>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Revenue</span>
          <span className={styles.cardValue}>R{stats.revenue.toFixed(2)}</span>
          <span className={styles.cardHint}>Total from reservations</span>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent reservations</h2>
          <Link to="/admin/reservations" className={styles.sectionLink}>
            View all
          </Link>
        </div>
        {recentReservations.length > 0 ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Accommodation</th>
                  <th>Guest</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((r) => (
                  <tr key={r._id}>
                    <td>
                      {r.accommodation?.title || 'N/A'}
                      {r.accommodation?.location && (
                        <span className={styles.muted}> · {r.accommodation.location}</span>
                      )}
                    </td>
                    <td>{r.user?.username || r.user?.email || '-'}</td>
                    <td>{formatDate(r.checkIn)}</td>
                    <td>{formatDate(r.checkOut)}</td>
                    <td>R{r.total?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.empty}>No reservations yet. When guests book your listings they will appear here.</p>
        )}
      </section>

      <div className={styles.actions}>
        <Link to="/admin/listings/new" className="btn btn-primary">
          Create new listing
        </Link>
        <Link to="/admin/listings" className="btn btn-secondary">
          Manage listings
        </Link>
      </div>
    </div>
  );
}
