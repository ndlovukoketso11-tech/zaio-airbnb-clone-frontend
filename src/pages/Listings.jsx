import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAccommodations } from '../services/api';
import styles from './Location.module.css';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAccommodations()
      .then(setListings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <p>Loading accommodations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '48px 24px' }}>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.heading}>
          {listings.length} accommodation{listings.length !== 1 ? 's' : ''} available
        </h1>

        <div className={styles.list}>
          {listings.map((item) => (
            <Link
              key={item._id}
              to={`/listing/${item._id}`}
              className={styles.card}
            >
              <div className={styles.cardImage}>
                <img
                  src={
                    item.images && item.images[0]
                      ? (item.images[0].startsWith('http') || item.images[0].startsWith('/')
                          ? item.images[0]
                          : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop')
                      : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
                  }
                  alt={item.title}
                />
              </div>
              <div className={styles.cardDetails}>
                <span className={styles.type}>{item.type}</span>
                <h2 className={styles.title}>{item.title}</h2>
                {item.amenities && item.amenities.length > 0 && (
                  <p className={styles.amenities}>
                    {item.amenities.slice(0, 3).join(' · ')}
                  </p>
                )}
                <div className={styles.meta}>
                  {item.rating > 0 && (
                    <span>★ {item.rating}</span>
                  )}
                  {item.reviews > 0 && (
                    <span>{item.reviews} reviews</span>
                  )}
                </div>
                <p className={styles.price}>
                  <strong>R{item.price}</strong> / night
                </p>
              </div>
            </Link>
          ))}
        </div>

        {listings.length === 0 && (
          <p className={styles.empty}>No listings in the database yet.</p>
        )}
      </div>
    </div>
  );
}
