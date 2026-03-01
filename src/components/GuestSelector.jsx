import styles from './GuestSelector.module.css';

function GuestRow({ label, subtitle, value, onDecrement, onIncrement, subtitleLink }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowLabel}>
        <span className={styles.label}>{label}</span>
        {subtitleLink ? (
          <a href="#" className={styles.subtitleLink} onClick={(e) => e.preventDefault()}>
            {subtitle}
          </a>
        ) : (
          <span className={styles.subtitle}>{subtitle}</span>
        )}
      </div>
      <div className={styles.counter}>
        <button
          type="button"
          className={styles.counterBtn}
          onClick={onDecrement}
          disabled={value <= 0}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className={styles.counterValue}>{value}</span>
        <button
          type="button"
          className={styles.counterBtn}
          onClick={onIncrement}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function formatGuestSummary(adults, children, infants, pets) {
  const total = adults + children + infants + pets;
  if (total === 0) return '';
  const parts = [];
  if (adults > 0) parts.push(adults === 1 ? '1 adult' : `${adults} adults`);
  if (children > 0) parts.push(children === 1 ? '1 child' : `${children} children`);
  if (infants > 0) parts.push(infants === 1 ? '1 infant' : `${infants} infants`);
  if (pets > 0) parts.push(pets === 1 ? '1 pet' : `${pets} pets`);
  return parts.join(', ');
}

export default function GuestSelector({ adults, children, infants, pets, onChange }) {
  const setAdults = (v) => onChange({ adults: v, children, infants, pets });
  const setChildren = (v) => onChange({ adults, children: v, infants, pets });
  const setInfants = (v) => onChange({ adults, children, infants: v, pets });
  const setPets = (v) => onChange({ adults, children, infants, pets: v });

  return (
    <div className={styles.panel} onMouseDown={(e) => e.stopPropagation()}>
      <GuestRow
        label="Adults"
        subtitle="Ages 13 or above"
        value={adults}
        onDecrement={() => setAdults(Math.max(0, adults - 1))}
        onIncrement={() => setAdults(adults + 1)}
      />
      <GuestRow
        label="Children"
        subtitle="Ages 2 – 12"
        value={children}
        onDecrement={() => setChildren(Math.max(0, children - 1))}
        onIncrement={() => setChildren(children + 1)}
      />
      <GuestRow
        label="Infants"
        subtitle="Under 2"
        value={infants}
        onDecrement={() => setInfants(Math.max(0, infants - 1))}
        onIncrement={() => setInfants(infants + 1)}
      />
      <GuestRow
        label="Pets"
        subtitle="Bringing a service animal?"
        value={pets}
        onDecrement={() => setPets(Math.max(0, pets - 1))}
        onIncrement={() => setPets(pets + 1)}
        subtitleLink
      />
    </div>
  );
}
