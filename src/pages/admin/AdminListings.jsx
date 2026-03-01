import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAccommodations, deleteAccommodation } from '../../services/api';
import styles from './Admin.module.css';

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadListings = () => {
    setLoading(true);
    setError(null);
    getAccommodations()
      .then(setListings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteAccommodation(id);
      loadListings();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className={styles.adminPage}>
        <p>Loading listings...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.adminTitle}>Manage Listings</h1>
      <div className={styles.adminActions}>
        <Link to="/admin/listings/new" className="btn btn-primary">
          Create new listing
        </Link>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={
                      item.images?.[0]
                        ? item.images[0].startsWith('http')
                          ? item.images[0]
                          : item.images[0]
                        : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=160&h=112&fit=crop'
                    }
                    alt={item.title}
                  />
                </td>
                <td>{item.title}</td>
                <td>{item.location}</td>
                <td>R{item.price}</td>
                <td className={styles.actionsCell}>
                  <Link to={`/admin/listings/edit/${item._id}`} className="btn btn-secondary">
                    Update
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(item._id, item.title)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {listings.length === 0 && !error && (
        <p>No listings yet. Create your first listing to get started.</p>
      )}
    </div>
  );
}
