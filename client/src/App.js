import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import LivreurDashboard from './pages/LivreurDashboard';
import RestaurateurDashboard from './pages/RestaurateurDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TestPage from './pages/TestPage';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/restaurants" element={<RestaurantList />} />
                <Route path="/restaurants/:id" element={<RestaurantDetails />} />
                <Route path="/test" element={<TestPage />} />

                {/* Routes protégées */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<Orders />} />
                </Route>

                {/* Routes par rôle */}
                <Route element={<RoleProtectedRoute roles={['livreur']} />}>
                  <Route path="/livreur" element={<LivreurDashboard />} />
                </Route>

                <Route element={<RoleProtectedRoute roles={['restaurateur']} />}>
                  <Route path="/restaurateur" element={<RestaurateurDashboard />} />
                </Route>

                <Route element={<RoleProtectedRoute roles={['admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App; 