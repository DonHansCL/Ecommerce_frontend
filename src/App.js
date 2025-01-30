// src/App.js
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AdminPanel from './pages/AdminPanel';
import Orders from './pages/Orders';
import ChangePassword from './pages/ChangePassword';
import AdminProducts from './pages/AdminProducts';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';


function App() {

  const PrivateRoute = ({ children }) => {
    const { token } = React.useContext(AuthContext);
    return token ? children : <Navigate to="/login" />;
  };

  return (

    <AuthProvider>
      <CartProvider>
        <ToastContainer />
        <ScrollToTop />
        <div className="App">
          <Navbar />          
          <div className="flex-grow pt-14">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Rutas Protegidas */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              >
                <Route path="profile" element={<Profile />} />
                <Route path="edit-profile" element={<EditProfile />} />
                <Route path="orders" element={<Orders />} />
                <Route path="change-password" element={<ChangePassword />} />
                
              </Route>

              {/* Rutas de Administración */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />

            </Routes>
          </div>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>

  );
}

export default App;