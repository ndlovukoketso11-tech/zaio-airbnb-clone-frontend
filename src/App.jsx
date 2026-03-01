import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Location from './pages/Location';
import Listings from './pages/Listings';
import LocationDetails from './pages/LocationDetails';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSignup from './pages/admin/AdminSignup';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminListings from './pages/admin/AdminListings';
import AdminCreateListing from './pages/admin/AdminCreateListing';
import AdminUpdateListing from './pages/admin/AdminUpdateListing';
import AdminReservations from './pages/admin/AdminReservations';

function ProtectedAdmin({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/location/:locationName" element={<Location />} />
          <Route path="/listing/:id" element={<LocationDetails />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdmin>
                <AdminDashboard />
              </ProtectedAdmin>
            }
          />
          <Route
            path="/admin/listings"
            element={
              <ProtectedAdmin>
                <AdminListings />
              </ProtectedAdmin>
            }
          />
          <Route
            path="/admin/listings/new"
            element={
              <ProtectedAdmin>
                <AdminCreateListing />
              </ProtectedAdmin>
            }
          />
          <Route
            path="/admin/listings/edit/:id"
            element={
              <ProtectedAdmin>
                <AdminUpdateListing />
              </ProtectedAdmin>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <ProtectedAdmin>
                <AdminReservations />
              </ProtectedAdmin>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
