import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccommodation } from '../../services/api';
import styles from './Admin.module.css';

const defaultForm = {
  title: '',
  location: '',
  description: '',
  bedrooms: '',
  bathrooms: '',
  guests: '',
  type: 'Entire apartment',
  price: '',
  amenities: '',
  images: '',
  weeklyDiscount: '0',
  cleaningFee: '0',
  serviceFee: '0',
  occupancyTaxes: '0',
};

export default function AdminCreateListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.location.trim()) e.location = 'Location is required.';
    if (!form.description.trim()) e.description = 'Description is required.';
    const beds = parseInt(form.bedrooms, 10);
    if (isNaN(beds) || beds < 0) e.bedrooms = 'Enter a valid number (0 or more).';
    const baths = parseInt(form.bathrooms, 10);
    if (isNaN(baths) || baths < 0) e.bathrooms = 'Enter a valid number (0 or more).';
    const g = parseInt(form.guests, 10);
    if (isNaN(g) || g < 1) e.guests = 'Enter at least 1 guest.';
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) e.price = 'Enter a valid price.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const amenities = form.amenities
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const images = form.images
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      await createAccommodation({
        title: form.title.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        bedrooms: parseInt(form.bedrooms, 10),
        bathrooms: parseInt(form.bathrooms, 10),
        guests: parseInt(form.guests, 10),
        type: form.type.trim(),
        price: parseFloat(form.price),
        weeklyDiscount: parseFloat(form.weeklyDiscount) || 0,
        cleaningFee: parseFloat(form.cleaningFee) || 0,
        serviceFee: parseFloat(form.serviceFee) || 0,
        occupancyTaxes: parseFloat(form.occupancyTaxes) || 0,
        amenities,
        images,
      });
      navigate('/admin');
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to create listing.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formPage}>
      <h1>Create new listing</h1>
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        {errors.submit && <p className="error-message">{errors.submit}</p>}

        <div className={styles.field}>
          <label>Title *</label>
          <input
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Modern apartment in Cape Town"
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>

        <div className={styles.field}>
          <label>Location *</label>
          <input
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            placeholder="e.g. Cape Town, Johannesburg, Durban"
          />
          {errors.location && <p className="error-message">{errors.location}</p>}
        </div>

        <div className={styles.field}>
          <label>Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Describe the property..."
          />
          {errors.description && <p className="error-message">{errors.description}</p>}
        </div>

        <div className={styles.field}>
          <label>Type</label>
          <input
            value={form.type}
            onChange={(e) => update('type', e.target.value)}
            placeholder="e.g. Entire apartment"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div className={styles.field}>
            <label>Bedrooms *</label>
            <input
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={(e) => update('bedrooms', e.target.value)}
            />
            {errors.bedrooms && <p className="error-message">{errors.bedrooms}</p>}
          </div>
          <div className={styles.field}>
            <label>Bathrooms *</label>
            <input
              type="number"
              min="0"
              value={form.bathrooms}
              onChange={(e) => update('bathrooms', e.target.value)}
            />
            {errors.bathrooms && <p className="error-message">{errors.bathrooms}</p>}
          </div>
          <div className={styles.field}>
            <label>Guests *</label>
            <input
              type="number"
              min="1"
              value={form.guests}
              onChange={(e) => update('guests', e.target.value)}
            />
            {errors.guests && <p className="error-message">{errors.guests}</p>}
          </div>
        </div>

        <div className={styles.field}>
          <label>Price per night (R) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
          />
          {errors.price && <p className="error-message">{errors.price}</p>}
        </div>

        <div className={styles.field}>
          <label>Amenities (comma or new line)</label>
          <textarea
            value={form.amenities}
            onChange={(e) => update('amenities', e.target.value)}
            placeholder="wifi, kitchen, free parking"
            rows={3}
          />
          <p className={styles.amenitiesHint}>Separate each amenity with a comma or new line.</p>
        </div>

        <div className={styles.field}>
          <label>Image URLs (one per line or comma-separated)</label>
          <textarea
            value={form.images}
            onChange={(e) => update('images', e.target.value)}
            placeholder="https://example.com/image1.jpg"
            rows={3}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          <div className={styles.field}>
            <label>Weekly discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.weeklyDiscount}
              onChange={(e) => update('weeklyDiscount', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Cleaning fee (R)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.cleaningFee}
              onChange={(e) => update('cleaningFee', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Service fee (R)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.serviceFee}
              onChange={(e) => update('serviceFee', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Occupancy taxes (R)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.occupancyTaxes}
              onChange={(e) => update('occupancyTaxes', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
