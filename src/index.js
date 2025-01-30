// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Router>
      <App />
      <ToastContainer
      preventDuplicates={true}          // No mostrar toasts duplicados
        position="top-right"               // Posición del toast
        autoClose={1200}                   // Duración en ms (2000ms = 2 segundos)
        hideProgressBar={false}            // Mostrar barra de progreso
        newestOnTop={false}                // Los toasts más nuevos no aparecen arriba
        closeOnClick
        rtl={false}                        // No usar layout de derecha a izquierda
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}                           // Máximo de toasts visibles simultáneamente
      />
    </Router>
  </React.StrictMode>
);