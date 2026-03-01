/**
 * API helper - base URL and auth token for requests.
 * In development, Vite proxies /api to the backend.
 */
const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || res.statusText || 'Request failed');
  }

  return data;
}

// User
export function login(email, password) {
  return apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(username, email, password, role = 'user') {
  return apiRequest('/users/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, role }),
  });
}

// Accommodations
export function getAccommodations() {
  return apiRequest('/accommodations');
}

export function getAccommodationById(id) {
  return apiRequest(`/accommodations/${id}`);
}

export function getAccommodationsByLocation(location) {
  return apiRequest(`/accommodations/location/${encodeURIComponent(location)}`);
}

export function createAccommodation(body) {
  return apiRequest('/accommodations', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateAccommodation(id, body) {
  return apiRequest(`/accommodations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function deleteAccommodation(id) {
  return apiRequest(`/accommodations/${id}`, { method: 'DELETE' });
}

// Reservations
export function createReservation(body) {
  return apiRequest('/reservations', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getReservationsByUser() {
  return apiRequest('/reservations/user');
}

export function getReservationsByHost() {
  return apiRequest('/reservations/host');
}

export function deleteReservation(id) {
  return apiRequest(`/reservations/${id}`, { method: 'DELETE' });
}
