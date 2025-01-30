// src/pages/Dashboard.js
import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaUser, FaEdit, FaBox, FaSignOutAlt, FaKey } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Dashboard() {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    toast.success('Has cerrado sesión.');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Sidebar */}
      <div className="w-48 md:w-64 bg-white dark:bg-gray-900 shadow-md z-10">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h2>
        </div>
        <nav className="mt-10">
          <Link to="/dashboard/profile" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaUser className="mr-3" />
            Perfil
          </Link>
          <Link to="/dashboard/edit-profile" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaEdit className="mr-3" />
            Editar Perfil
          </Link>
          <Link to="/dashboard/orders" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaBox className="mr-3" />
            Pedidos
          </Link>
          <Link to="/dashboard/change-password" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
            <FaKey className="mr-3" />
            Cambiar Contraseña
          </Link>
          <button onClick={handleLogout} className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-left">
            <FaSignOutAlt className="mr-3" />
            Cerrar Sesión
          </button>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;