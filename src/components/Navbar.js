// src/components/Navbar.js
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaBars, FaTimes, FaUserCircle, FaSearch } from 'react-icons/fa';
import { debounce } from 'lodash';

function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef();
  const [searchQuery, setSearchQuery] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoriasLoading, setCategoriasLoading] = useState(false);
  const [categoriasError, setCategoriasError] = useState('');


  // Calcula la cantidad total de items en el carrito
  const totalItems = cartItems.reduce((sum, item) => sum + item.cantidad, 0);


  // Decodificar el token para obtener el rol
  let payload;
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      payload = JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    navigate(`/catalog?${params.toString()}`);
    setSearchQuery('');
  };

  // Cierra el menú de perfil al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Obtener las categorías disponibles con manejo de carga y errores
  const fetchCategorias = async () => {
    setCategoriasLoading(true);
    setCategoriasError('');
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      if (!res.ok) {
        throw new Error('Respuesta inválida del servidor al obtener categorías.');
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Formato de datos inválido para categorías.');
      }
      setCategorias(data);
    } catch (err) {
      console.error('Error al cargar las categorías:', err);
      setCategoriasError('No se pudieron cargar las categorías.');
    } finally {
      setCategoriasLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Manejar la búsqueda con debounce para evitar demasiadas solicitudes
  const debouncedSearch = useRef(
    debounce((query) => {
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
    }, 500)
  ).current;

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, debouncedSearch]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/catalog?category=${encodeURIComponent(categoryId)}`);
    setIsMobileMenuOpen(false);
  };


  return (
    <nav className="navbar bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center flex-1">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img className="h-8 w-auto" src="/images/logo.png" alt="Ecommerce Logo" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex ml-6 space-x-4">
              <Link
                to="/"
                className="text-md font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
              >
                Inicio
              </Link>
              {/* Categorias Dropdown */}
              <div className="relative group">
                <button
                  className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300 flex items-center focus:outline-none"
                >
                  Categorías
                  <svg
                    className="ml-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {categoriasLoading ? (
                    <div className="px-4 py-2 text-gray-700 dark:text-gray-200">Cargando...</div>
                  ) : categoriasError ? (
                    <div className="px-4 py-2 text-red-500">{categoriasError}</div>
                  ) : categorias.length > 0 ? (
                    categorias.map((categoria) => (
                      <button
                        key={categoria.id}
                        onClick={() => handleCategoryClick(categoria.id)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        {categoria.nombre}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-700 dark:text-gray-200">No hay categorías</div>
                  )}
                </div>
              </div>

              {payload && payload.rol === 'administrador' && (
                <Link
                  to="/admin"
                  className="text-md font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full px-4 py-1 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-1 mr-2"
              >
                <FaSearch className="h-4 w-4 text-gray-500" />
              </button>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Profile Icon */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isProfileMenuOpen}
              >
                <FaUserCircle size={24} />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-20">
                  {token ? (
                    <>
                      <Link
                        to="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Ver Perfil
                      </Link>
                      <Link
                        to="/dashboard/edit-profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Editar Perfil
                      </Link>
                      <Link
                        to="/dashboard/orders"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Mis Pedidos
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Iniciar Sesión
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Registrarse
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
            >
              <FaShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 focus:outline-none"
              >
                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md">
          <div className="px-4 pt-4 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            {/* Categorias Mobile */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-700 dark:text-gray-200">Categorías</span>
                <span className="text-gray-500 dark:text-gray-400">{categorias.length}</span>
              </div>
              <div className="mt-2 space-y-1">
                {categoriasLoading ? (
                  <div className="px-4 py-2 text-gray-700 dark:text-gray-200">Cargando...</div>
                ) : categoriasError ? (
                  <div className="px-4 py-2 text-red-500">{categoriasError}</div>
                ) : categorias.length > 0 ? (
                  categorias.map((categoria) => (
                    <button
                      key={categoria.id}
                      onClick={() => handleCategoryClick(categoria.id)}
                      className="block w-full text-left text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300 px-4 py-2 rounded-md"
                    >
                      {categoria.nombre}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-700 dark:text-gray-200">No hay categorías</div>
                )}
              </div>
            </div>

            {payload && payload.rol === 'administrador' && (
              <Link
                to="/admin"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            {/* Búsqueda Mobile */}
            <form onSubmit={handleSearch} className="mt-4 flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Buscar
              </button>
            </form>

            {/* Icono de Carrito Mobile */}
            <Link
              to="/cart"
              className="relative flex items-center text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300 mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
              <span className="ml-2 text-lg">Carrito</span>
            </Link>

            {/* Perfil / Login Mobile */}
            {token ? (
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <Link
                  to="/dashboard/profile"
                  className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Perfil
                </Link>
                <Link
                  to="/dashboard/orders"
                  className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mis Pedidos
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300 mt-2"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300 mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            )}

            {/* Rutas de Administración Mobile */}
            {payload && payload.rol === 'administrador' && (
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <Link
                  to="/admin"
                  className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Panel de Administración
                </Link>
                <Link
                  to="/admin/products"
                  className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Gestionar Productos
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;