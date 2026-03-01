import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAccommodationsByLocation, getAccommodations } from '../services/api';
import Footer from '../components/Footer';
import DateRangeCalendar, { formatDateRange } from '../components/DateRangeCalendar';
import GuestSelector, { formatGuestSummary } from '../components/GuestSelector';
import styles from './Home.module.css';

// Asset images from frontend/assets – used for listing cards and placeholders
import assetImg1 from '../../assets/265dd0b2-9a3f-4b17-a5af-cc877e95b01e.avif';
import assetImg2 from '../../assets/6e6777a5-0847-45e9-a3c6-47ccfca7c600.avif';
import assetImg3 from '../../assets/8e13b91d-757c-458b-a962-a05eedb99b7b.avif';
import assetImg4 from '../../assets/b263a6e5-7b36-47d6-9054-a58d164e258f.avif';
import assetImg5 from '../../assets/dcaa47ba-8daa-41f8-b19c-6c1e6a00030e.avif';

const ASSET_IMAGES = [assetImg1, assetImg2, assetImg3, assetImg4, assetImg5];

function getAssetImageForIndex(index) {
  return ASSET_IMAGES[Math.abs(index) % ASSET_IMAGES.length];
}

const inspirationLocations = [
  { name: 'Cape Town', path: 'Cape Town', image: assetImg1 },
  { name: 'Durban', path: 'Durban', image: assetImg2 },
  { name: 'Johannesburg', path: 'Johannesburg', image: assetImg3 },
  { name: 'Pretoria', path: 'Pretoria', image: assetImg4 },
];

const PLACEHOLDER_TITLES_CT = ['Condo in Cape Town', 'Apartment in Cape Town', 'Guesthouse in Cape Town', 'Place to stay in Sea Point'];
const PLACEHOLDER_TITLES_DB = ['Guest suite in Durban', 'Apartment in Durban North', 'Guesthouse in Berea', 'Place to stay in Umhlanga'];
const PLACEHOLDER_TITLES_JHB = ['Apartment in Sandton', 'Place to stay in Rosebank', 'Guesthouse in Johannesburg', 'Condo in Melville'];

const suggestedDestinations = [
  { label: 'Nearby', value: 'Nearby', subtitle: 'Find what\'s around you' },
  { label: 'Cape Town, Western Cape', value: 'Cape Town', subtitle: 'Because your wishlist has stays in Cape Town' },
  { label: 'Durban, KwaZulu-Natal', value: 'Durban', subtitle: 'Popular beach destination' },
  { label: 'Sandton, Gauteng', value: 'Sandton', subtitle: 'For sights like Sandton City' },
  { label: 'Port Elizabeth', value: 'Port Elizabeth', subtitle: 'For nature-lovers' },
  { label: 'Bloemfontein, Free State', value: 'Bloemfontein', subtitle: 'Popular with travelers near you' },
  { label: 'Randburg, Gauteng', value: 'Randburg', subtitle: 'Near you' },
];

function ListingCard({ item, nights = 2, imageIndex = 0 }) {
  const hasValidImage = item.images?.[0] && (item.images[0].startsWith('http') || item.images[0].startsWith('/'));
  const imgSrc = hasValidImage ? item.images[0] : getAssetImageForIndex(imageIndex);
  const isPlaceholder = item.isPlaceholder;
  const linkTo = isPlaceholder
    ? `/location/${encodeURIComponent(item.location)}`
    : `/listing/${item._id}`;

  return (
    <Link to={linkTo} className={styles.listingCard}>
      <div className={styles.listingCardImage}>
        <img src={imgSrc} alt={item.title} />
        <span className={styles.guestFavorite}>Guest favourite</span>
        <button type="button" className={styles.heartBtn} aria-label="Save">♡</button>
      </div>
      <div className={styles.listingCardBody}>
        <h3 className={styles.listingCardTitle}>{item.title}</h3>
        <p className={styles.listingCardPrice}>
          R{((item.price || 0) * nights).toLocaleString()} ZAR for {nights} nights
        </p>
        {item.rating > 0 && (
          <p className={styles.listingCardRating}>★ {item.rating}</p>
        )}
      </div>
    </Link>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [where, setWhere] = useState('');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 });
  const [capeTownListings, setCapeTownListings] = useState([]);
  const [durbanListings, setDurbanListings] = useState([]);
  const [johannesburgListings, setJohannesburgListings] = useState([]);
  const [recommendedListings, setRecommendedListings] = useState([]);

  useEffect(() => {
    getAccommodations().then(setRecommendedListings).catch(() => setRecommendedListings([]));
    getAccommodationsByLocation('Cape Town').then(setCapeTownListings).catch(() => setCapeTownListings([]));
    getAccommodationsByLocation('Durban').then(setDurbanListings).catch(() => setDurbanListings([]));
    getAccommodationsByLocation('Johannesburg').then(setJohannesburgListings).catch(() => setJohannesburgListings([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const loc = where.trim();
    if (loc) {
      setSuggestionsOpen(false);
      navigate(`/location/${encodeURIComponent(loc)}`);
    }
  };

  const handleSelectSuggestion = (value) => {
    setWhere(value);
    setSuggestionsOpen(false);
    navigate(`/location/${encodeURIComponent(value)}`);
  };

  const handleWhenFocus = () => {
    setSuggestionsOpen(false);
    setCalendarOpen(true);
  };

  const handleDatesChange = (start, end) => {
    setCheckIn(start);
    setCheckOut(end);
  };

  const handleWhoFocus = () => {
    setSuggestionsOpen(false);
    setCalendarOpen(false);
    setGuestsOpen(true);
  };

  const totalGuests = guests.adults + guests.children + guests.infants + guests.pets;
  const whoDisplay = totalGuests === 0 ? '' : formatGuestSummary(guests.adults, guests.children, guests.infants, guests.pets);

  return (
    <div className={styles.page}>
      {/* Search bar hero */}
      <section className={styles.heroSearch}>
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <div
            className={`${styles.searchSegment} ${styles.searchSegmentWhere}`}
            onFocus={() => setSuggestionsOpen(true)}
            onBlur={() => setTimeout(() => setSuggestionsOpen(false), 200)}
          >
            <label className={styles.searchLabel}>Where</label>
            <input
              type="text"
              placeholder="Search destinations"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              className={styles.searchInput}
              autoComplete="off"
            />
            {suggestionsOpen && (
              <div className={styles.suggestionsDropdown}>
                <p className={styles.suggestionsTitle}>Suggested destinations</p>
                {suggestedDestinations.map((dest) => (
                  <button
                    key={dest.value}
                    type="button"
                    className={styles.suggestionItem}
                    onMouseDown={(e) => { e.preventDefault(); handleSelectSuggestion(dest.value); }}
                  >
                    <div className={styles.suggestionText}>
                      <span className={styles.suggestionLabel}>{dest.label}</span>
                      <span className={styles.suggestionSubtitle}>{dest.subtitle}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={styles.searchDivider} />
          <div
            className={`${styles.searchSegment} ${styles.searchSegmentWhen}`}
            onFocus={handleWhenFocus}
          >
            <label className={styles.searchLabel}>When</label>
            <input
              type="text"
              placeholder="Add dates"
              readOnly
              value={formatDateRange(checkIn, checkOut)}
              className={styles.searchInput}
            />
            {calendarOpen && (
              <>
                <div
                  className={styles.calendarBackdrop}
                  aria-hidden
                  onClick={() => setCalendarOpen(false)}
                />
                <DateRangeCalendar
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onChange={handleDatesChange}
                  onClose={() => setCalendarOpen(false)}
                />
              </>
            )}
          </div>
          <div className={styles.searchDivider} />
          <div
            className={`${styles.searchSegment} ${styles.searchSegmentWho}`}
            onFocus={handleWhoFocus}
          >
            <label className={styles.searchLabel}>Who</label>
            <input
              type="text"
              placeholder="Add guests"
              readOnly
              value={whoDisplay}
              className={styles.searchInput}
            />
            {guestsOpen && (
              <>
                <div
                  className={styles.calendarBackdrop}
                  aria-hidden
                  onClick={() => setGuestsOpen(false)}
                />
                <GuestSelector
                  adults={guests.adults}
                  children={guests.children}
                  infants={guests.infants}
                  pets={guests.pets}
                  onChange={setGuests}
                />
              </>
            )}
          </div>
          <button type="submit" className={styles.searchSubmit} aria-label="Search">
            <span className={styles.searchIcon}>🔍</span>
          </button>
        </form>
      </section>

      {/* Recommended stays – from database */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionRow}>
            <h2 className={styles.sectionTitle}>Recommended stays</h2>
            <Link to="/listings" className={styles.sectionArrow}>
              Show all →
            </Link>
          </div>
          <div className={styles.listingScroll}>
            {recommendedListings.length > 0 ? (
              recommendedListings.map((item, i) => (
                <ListingCard key={item._id} item={item} imageIndex={i} />
              ))
            ) : (
              <p className={styles.emptySection}>No listings in the database yet. Add some from the admin dashboard.</p>
            )}
          </div>
        </div>
      </section>

      {/* Popular homes in Cape Town */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionRow}>
            <h2 className={styles.sectionTitle}>Popular homes in Cape Town</h2>
            <Link to="/location/Cape%20Town" className={styles.sectionArrow}>
              Show all →
            </Link>
          </div>
          <div className={styles.listingScroll}>
            {capeTownListings.length > 0 ? (
              capeTownListings.map((item, i) => (
                <ListingCard key={item._id} item={item} imageIndex={i} />
              ))
            ) : (
              PLACEHOLDER_TITLES_CT.map((title, i) => (
                <ListingCard
                  key={`placeholder-ct-${i}`}
                  item={{
                    isPlaceholder: true,
                    location: 'Cape Town',
                    title,
                    price: 1200 + i * 200,
                    rating: 4.5 + (i % 3) * 0.2,
                  }}
                  imageIndex={i}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Available next month in Durban */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionRow}>
            <h2 className={styles.sectionTitle}>Available next month in Durban</h2>
            <Link to="/location/Durban" className={styles.sectionArrow}>
              Show all →
            </Link>
          </div>
          <div className={styles.listingScroll}>
            {durbanListings.length > 0 ? (
              durbanListings.map((item, i) => (
                <ListingCard key={item._id} item={item} imageIndex={i + 10} />
              ))
            ) : (
              PLACEHOLDER_TITLES_DB.map((title, i) => (
                <ListingCard
                  key={`placeholder-db-${i}`}
                  item={{
                    isPlaceholder: true,
                    location: 'Durban',
                    title,
                    price: 1100 + i * 150,
                    rating: 4.6 + (i % 2) * 0.2,
                  }}
                  imageIndex={i + 4}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Stay in Johannesburg */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionRow}>
            <h2 className={styles.sectionTitle}>Stay in Johannesburg</h2>
            <Link to="/location/Johannesburg" className={styles.sectionArrow}>
              Show all →
            </Link>
          </div>
          <div className={styles.listingScroll}>
            {johannesburgListings.length > 0 ? (
              johannesburgListings.map((item, i) => (
                <ListingCard key={item._id} item={item} imageIndex={i + 20} />
              ))
            ) : (
              PLACEHOLDER_TITLES_JHB.map((title, i) => (
                <ListingCard
                  key={`placeholder-jhb-${i}`}
                  item={{
                    isPlaceholder: true,
                    location: 'Johannesburg',
                    title,
                    price: 1300 + i * 180,
                    rating: 4.5 + (i % 3) * 0.15,
                  }}
                  imageIndex={i + 8}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Inspiration */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Inspiration for your next trip</h2>
          <div className={styles.cardGrid}>
            {inspirationLocations.map((loc) => (
              <Link
                key={loc.name}
                to={`/location/${encodeURIComponent(loc.path)}`}
                className={styles.card}
              >
                <img src={loc.image} alt={loc.name} className={styles.cardImg} />
                <span className={styles.cardLabel}>{loc.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
