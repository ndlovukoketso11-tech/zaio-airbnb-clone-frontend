import { useState, useEffect } from 'react';
import { getReservationsByHost, deleteReservation } from '../../services/api';
import styles from './Admin.module.css';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getReservationsByHost()
      .then(setReservations)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await deleteReservation(id);
      load();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString();
  };

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.adminTitle}>Reservations</h1>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading reservations...</p>
      ) : (
      <>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Accommodation</th>
              <th>Guest</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Guests</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r._id}>
                <td>
                  {r.accommodation?.title || 'N/A'} ({r.accommodation?.location || ''})
                </td>
                <td>{r.user?.username || r.user?.email || '-'}</td>
                <td>{formatDate(r.checkIn)}</td>
                <td>{formatDate(r.checkOut)}</td>
                <td>{r.guests}</td>
                <td>R{r.total?.toFixed(2)}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(r._id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reservations.length === 0 && !error && (
        <p>No reservations found.</p>
      )}
      </>
      )}
    </div>
  );
}
