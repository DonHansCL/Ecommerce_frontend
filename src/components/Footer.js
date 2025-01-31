import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Sobre Nosotros</h3>
            <p className="text-gray-600 text-sm">
              Somos tu tienda de confianza, ofreciendo los mejores productos con la mejor calidad y servicio.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-600 transition-colors duration-300">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-600 transition-colors duration-300">
                <FaInstagram size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700 transition-colors duration-300">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 text-sm">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 text-sm">
                  Mis Pedidos
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contáctanos</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-gray-400" />
                <span className="text-gray-600 text-sm">Ciudad, País</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhone className="text-gray-400" />
                <span className="text-gray-600 text-sm">+1 234 567 890</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-gray-400" />
                <span className="text-gray-600 text-sm">contacto@tutienda.com</span>
              </li>
            </ul>
          </div>

          {/* Additional Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Cuenta</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 text-sm">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 text-sm">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Derechos Reservados */}
        <div className="mt-6 pt-8 border-t border-gray-300">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Tu Tienda. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;