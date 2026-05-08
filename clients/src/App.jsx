import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Login from './components/Login'
import Bookings from "./components/Bookings";
import Home from './pages/Home';
import Footer from "./components/Footer.jsx";
import { Navigate } from 'react-router-dom';


// Admin
import Admin from './pages/Admin.jsx';
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdmBookings from "./pages/admin/AdmBookings.jsx";
import AdmLayanan from "./pages/admin/AdmLayanan.jsx";
import AdmBarbers from "./pages/admin/AdmBarbers.jsx";
import AdmBarbershop from "./pages/admin/AdmBarbershop.jsx";
import AdmJadwal from "./pages/admin/AdmJadwal.jsx";
import AdmUser from "./pages/admin/AdmUser.jsx";
import AdmOrderBook from "./pages/admin/AdmOrderBook.jsx";

function App() {
  const [count, setCount] = useState(0)
  const [showLogin, setShowLogin] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'));

  return (
          <Router basename="/cutz">
              <Routes>
                  {/* --- RUTE CUSTOMER --- */}
                  <Route path="/" element={
                      <>
                          <Navbar setShowLogin={setShowLogin}/>
                          <Home />
                      </>
                  } />

                  <Route path="/Bookings" element={
                      <div className="flex flex-col min-h-screen">
                          <Navbar setShowLogin={setShowLogin}/>

                          <main className="flex-grow">
                              <Bookings />
                          </main>

                          <Footer />
                      </div>
                  } />

                  {/* --- RUTE ADMIN --- */}
                  <Route
                      path="/admin"
                      element={
                          user && (user.Role === 'Owner' || user.Role === 'Admin')
                              ? <Admin />
                              : <Navigate to="/" replace />
                      }
                  >

                      <Route index element={<Dashboard />} />
                      <Route path="bookings" element={<AdmBookings />} />
                      <Route path="services" element={<AdmLayanan />} />
                      <Route path="barbers" element={<AdmBarbers />} />
                      <Route path="barbershop" element={<AdmBarbershop />} />
                      <Route path="jadwal" element={<AdmJadwal />} />
                      <Route path="user" element={<AdmUser />} />
                      <Route path="order" element={<AdmOrderBook />} />

                  </Route>
              </Routes>

              {showLogin && <Login setShowLogin={setShowLogin} />}
          </Router>
  )
}

export default App
