import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAccommodationsByLocation } from '../services/api';
import styles from './Location.module.css';

// Asset images for placeholder cards (same as Home)
import assetImg1 from '../../assets/265dd0b2-9a3f-4b17-a5af-cc877e95b01e.avif';
import assetImg2 from '../../assets/6e6777a5-0847-45e9-a3c6-47ccfca7c600.avif';
import assetImg3 from '../../assets/8e13b91d-757c-458b-a962-a05eedb99b7b.avif';
import assetImg4 from '../../assets/b263a6e5-7b36-47d6-9054-a58d164e258f.avif';
import assetImg5 from '../../assets/dcaa47ba-8daa-41f8-b19c-6c1e6a00030e.avif';

const ASSET_IMAGES = [assetImg1, assetImg2, assetImg3, assetImg4, assetImg5];

function getAssetImageForIndex(index) {
  return ASSET_IMAGES[Math.abs(index) % ASSET_IMAGES.length];
}

const PLACEHOLDER_TITLES_CT = ['Condo in Cape Town', 'Apartment in Cape Town', 'Guesthouse in Cape Town', 'Place to stay in Sea Point'];
const PLACEHOLDER_TITLES_DB = ['Guest suite in Durban', 'Apartment in Durban North', 'Guesthouse in Berea', 'Place to stay in Umhlanga'];
const PLACEHOLDER_TITLES_JHB = ['Apartment in Sandton', 'Place to stay in Rosebank', 'Guesthouse in Johannesburg', 'Condo in Melville'];

const PLACEHOLDER_BY_LOCATION = {
  'Cape Town': PLACEHOLDER_TITLES_CT,
  'Durban': PLACEHOLDER_TITLES_DB,
  'Johannesburg': PLACEHOLDER_TITLES_JHB,
};

function getPlaceholderTitles(displayName) {
  return PLACEHOLDER_BY_LOCATION[displayName] ?? [
    `Apartment in ${displayName}`,
    `Place to stay in ${displayName}`,
    `Guesthouse in ${displayName}`,
    `Condo in ${displayName}`,
  ];
}

export default function Location() {
  const { locationName } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!locationName) return;
    setLoading(true);
    setError(null);
    getAccommodationsByLocation(locationName)
      .then(setListings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [locationName]);

  const displayName = decodeURIComponent(locationName || '');
  const showPlaceholders = !loading && !error && listings.length === 0;
  const placeholderTitles = showPlaceholders ? getPlaceholderTitles(displayName) : [];

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
        <p>Try searching for another location.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.heading}>
          {showPlaceholders
            ? `Popular homes in ${displayName}`
            : `${listings.length} accommodation${listings.length !== 1 ? 's' : ''} in ${displayName}`}
        </h1>

        <div className={styles.list}>
          {listings.length > 0 ? (
            listings.map((item) => (
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
            ))
          ) : showPlaceholders ? (
            placeholderTitles.map((title, i) => (
              <div key={`placeholder-${displayName}-${i}`} className={styles.card}>
                <div className={styles.cardImage}>
                  <img
                    src={getAssetImageForIndex(i)}
                    alt={title}
                  />
                </div>
                <div className={styles.cardDetails}>
                  <span className={styles.type}>
                    {title.includes('Condo') ? 'Condo' : title.includes('Apartment') ? 'Apartment' : title.includes('Guesthouse') ? 'Guesthouse' : title.includes('Guest suite') ? 'Guest suite' : 'Place to stay'}
                  </span>
                  <h2 className={styles.title}>{title}</h2>
                  <div className={styles.meta}>
                    <span>★ {[4.5, 4.7, 4.9, 4.5][i % 4]}</span>
                  </div>
                  <p className={styles.price}>
                    <strong>R{1200 + i * 200}</strong> / night
                  </p>
                </div>
              </div>
            ))
          ) : null}
        </div>
      </div>
    </div>
  );
}
