import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAccommodationById, createReservation } from '../services/api';
import { useAuth } from '../context/AuthContext';
import styles from './LocationDetails.module.css';

function getImageUrl(img) {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  if (img.startsWith('/')) return img;
  return img;
}

export default function LocationDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [reserving, setReserving] = useState(false);
  const [reserveError, setReserveError] = useState(null);
  const [reserveSuccess, setReserveSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getAccommodationById(id)
      .then(setListing)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const images = listing?.images?.length
    ? listing.images
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'];
  const mainImage = getImageUrl(images[0]) || images[0];
  const sideImages = images.slice(1, 5);

  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    : 0;
  const subtotal = listing ? listing.price * (nights || 0) : 0;
  const weeklyDiscount = listing?.weeklyDiscount && nights >= 7
    ? (subtotal * listing.weeklyDiscount) / 100
    : 0;
  const cleaningFee = listing?.cleaningFee || 0;
  const serviceFee = listing?.serviceFee || 0;
  const occupancyTaxes = listing?.occupancyTaxes || 0;
  const total = subtotal - weeklyDiscount + cleaningFee + serviceFee + occupancyTaxes;

  const handleReserve = async (e) => {
    e.preventDefault();
    if (!user) {
      setReserveError('Please log in to make a reservation.');
      return;
    }
    if (!checkIn || !checkOut || nights < 1) {
      setReserveError('Please select check-in and check-out dates.');
      return;
    }
    setReserving(true);
    setReserveError(null);
    try {
      await createReservation({
        accommodationId: id,
        checkIn,
        checkOut,
        guests,
      });
      setReserveSuccess(true);
    } catch (err) {
      setReserveError(err.message || 'Failed to create reservation.');
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container" style={{ padding: '48px 24px' }}>
        <p className="error-message">{error || 'Listing not found.'}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.heading}>{listing.type} in {listing.location}</h1>
        <p className={styles.subheading}>
          {listing.rating > 0 && <>★ {listing.rating} · </>}
          {listing.location}
        </p>

        {/* Image gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img src={mainImage} alt={listing.title} />
          </div>
          <div className={styles.sideImages}>
            {sideImages.map((src, i) => (
              <div key={i} className={styles.sideImgWrap}>
                <img src={getImageUrl(src) || src} alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* Two columns: details + calculator */}
        <div className={styles.twoCol}>
          <div className={styles.leftCol}>
            <h2>{listing.title}</h2>
            <p className={styles.details}>
              {listing.guests} guests · {listing.bedrooms} bedrooms · {listing.bathrooms} bathrooms
            </p>
            {listing.description && <p className={styles.description}>{listing.description}</p>}
            {listing.amenities?.length > 0 && (
              <>
                <h3>What this place offers</h3>
                <ul className={styles.amenitiesList}>
                  {listing.amenities.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </>
            )}
            <h3>Where you'll sleep</h3>
            <p>Bedrooms and bathrooms as listed above.</p>
            <h3>7 nights in {listing.location}</h3>
            <p>Full access to the accommodation.</p>
            {listing.reviews > 0 && (
              <>
                <h3>Reviews</h3>
                <p>★ {listing.rating} · {listing.reviews} reviews</p>
              </>
            )}
            <h3>Host</h3>
            <p>Hosted by {listing.host || 'Host'}</p>
            <h3>House Rules</h3>
            <p>Check-in after 3:00 PM · Check-out before 11:00 AM</p>
            <h3>Health & Safety</h3>
            <p>Committed to enhanced cleaning process.</p>
            <h3>Cancellation Policy</h3>
            <p>Free cancellation before 24 hours of check-in.</p>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.calculator}>
              <p className={styles.calcPrice}>
                <strong>R{listing.price}</strong> night
              </p>
              <div className={styles.calcFields}>
                <div className={styles.field}>
                  <label>Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Guests</label>
                  <input
                    type="number"
                    min="1"
                    max={listing.guests || 10}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  />
                </div>
              </div>

              <button
                type="button"
                className={`btn btn-primary ${styles.reserveBtn}`}
                onClick={handleReserve}
                disabled={reserving}
              >
                {reserving ? 'Reserving...' : 'Reserve'}
              </button>

              {reserveError && <p className="error-message">{reserveError}</p>}
              {reserveSuccess && <p className={styles.success}>Reservation created successfully!</p>}

              <div className={styles.calcSummary}>
                <p>R{listing.price} x {nights || 0} nights</p>
                <p>R{subtotal.toFixed(2)}</p>
              </div>
              {weeklyDiscount > 0 && (
                <div className={styles.calcSummary}>
                  <p>Weekly discount ({listing.weeklyDiscount}%)</p>
                  <p>-R{weeklyDiscount.toFixed(2)}</p>
                </div>
              )}
              <div className={styles.calcSummary}>
                <p>Cleaning fee</p>
                <p>R{cleaningFee.toFixed(2)}</p>
              </div>
              <div className={styles.calcSummary}>
                <p>Service fee</p>
                <p>R{serviceFee.toFixed(2)}</p>
              </div>
              <div className={styles.calcSummary}>
                <p>Occupancy taxes and fees</p>
                <p>R{occupancyTaxes.toFixed(2)}</p>
              </div>
              <div className={`${styles.calcSummary} ${styles.totalRow}`}>
                <p>Total</p>
                <p>R{total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
