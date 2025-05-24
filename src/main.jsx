// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import App from './App.jsx';
import { Login } from './Login.jsx';
import './index.css';

const isAuthenticated = () => localStorage.getItem('username') !== null;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/tienda" />
            ) : (
              <Login onLogin={() => (window.location.href = '/tienda')} />
            )
          }
        />
        <Route
          path="/tienda"
          element={
            isAuthenticated() ? (
              <App />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);