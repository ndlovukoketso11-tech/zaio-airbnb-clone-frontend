import { useState } from 'react';
import styles from './DateRangeCalendar.module.css';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getDaysInMonth(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const days = last.getDate();
  return { startPad, days, year, month };
}

function sameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date, start, end) {
  if (!start || !end) return false;
  const t = date.getTime();
  return t > start.getTime() && t < end.getTime();
}

function isPast(date) {
  const d = new Date(date.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}

export function formatDateRange(start, end) {
  if (!start) return '';
  if (!end || sameDay(start, end)) {
    return `${MONTHS_SHORT[start.getMonth()]} ${start.getDate()}`;
  }
  return `${MONTHS_SHORT[start.getMonth()]} ${start.getDate()} – ${MONTHS_SHORT[end.getMonth()]} ${end.getDate()}`;
}

const FLEX_OPTIONS = ['Exact dates', '± 1 day', '± 2 days', '± 3 days', '± 7 days', '± 14 days'];

export default function DateRangeCalendar({ checkIn, checkOut, onChange, onClose }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [flexIndex, setFlexIndex] = useState(0);

  const handleDateClick = (year, month, day) => {
    const date = new Date(year, month, day);
    if (isPast(new Date(year, month, day))) return;

    if (!checkIn || (checkIn && checkOut)) {
      onChange(date, null);
    } else {
      if (date.getTime() <= checkIn.getTime()) {
        onChange(date, null);
      } else {
        onChange(checkIn, date);
      }
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const month1 = getDaysInMonth(viewYear, viewMonth);
  const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
  const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
  const month2 = getDaysInMonth(nextY, nextM);

  const renderCalendar = (year, month, startPad, days) => (
    <div className={styles.calendar}>
      <p className={styles.calendarMonthLabel}>{MONTHS[month]} {year}</p>
      <div className={styles.weekdayRow}>
        {WEEKDAYS.map((d) => (
          <span key={d} className={styles.weekday}>{d}</span>
        ))}
      </div>
      <div className={styles.daysGrid}>
        {Array.from({ length: startPad }, (_, i) => (
          <span key={`pad-${i}`} className={styles.dayPad} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const isStart = checkIn && sameDay(date, checkIn);
          const isEnd = checkOut && sameDay(date, checkOut);
          const inRange = isInRange(date, checkIn, checkOut);
          const disabled = isPast(new Date(year, month, day));
          return (
            <button
              key={day}
              type="button"
              className={`${styles.day} ${isStart ? styles.dayStart : ''} ${isEnd ? styles.dayEnd : ''} ${inRange ? styles.dayInRange : ''} ${disabled ? styles.dayDisabled : ''}`}
              onClick={() => handleDateClick(year, month, day)}
              disabled={disabled}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={styles.overlay} onMouseDown={(e) => e.stopPropagation()}>
      <div className={styles.popup}>
        <div className={styles.tabs}>
          <button type="button" className={`${styles.tab} ${styles.tabActive}`}>Dates</button>
          <button type="button" className={styles.tab}>Months</button>
          <button type="button" className={styles.tab}>Flexible</button>
        </div>
        <div className={styles.navRow}>
          <button type="button" className={styles.navBtn} onClick={prevMonth} aria-label="Previous month">
            ‹
          </button>
          <div className={styles.calendars}>
            {renderCalendar(month1.year, month1.month, month1.startPad, month1.days)}
            {renderCalendar(month2.year, month2.month, month2.startPad, month2.days)}
          </div>
          <button type="button" className={styles.navBtn} onClick={nextMonth} aria-label="Next month">
            ›
          </button>
        </div>
        <div className={styles.flexRow}>
          <p className={styles.flexLabel}>Date flexibility</p>
          <div className={styles.flexPills}>
            {FLEX_OPTIONS.map((label, i) => (
              <button
                key={label}
                type="button"
                className={`${styles.flexPill} ${i === flexIndex ? styles.flexPillActive : ''}`}
                onClick={() => setFlexIndex(i)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
