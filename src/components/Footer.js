import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Información de la Empresa */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Sobre Nosotros</h3>
          <p className="text-gray-600 text-sm">
            Somos una tienda en línea comprometida con ofrecer los mejores productos a precios accesibles.
          </p>
        </div>

        {/* Enlaces Rápidos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Enlaces Rápidos</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/sobre" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 text-sm">
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 text-sm">
                Contacto
              </Link>
            </li>
            <li>
              <Link to="/blog" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 text-sm">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Redes Sociales */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Síguenos</h3>
          <div className="flex space-x-4">
            <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">
              <FaFacebook size={20} />
            </Link>
            <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">
              <FaTwitter size={20} />
            </Link>
            <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">
              <FaInstagram size={20} />
            </Link>
          </div>
        </div>

      </div>

      {/* Derechos Reservados */}
      <div className="mt-8 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Tu Tienda. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;