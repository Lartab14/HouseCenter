import { useState, useEffect } from 'react';
import '@google/model-viewer';
import { productos } from './data';
import { Carrito } from './Carrito';
import { Favoritos } from './Favoritos';
import { Historial } from './Historial';
import { Checkout } from './Checkout';
import './App.css';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarCheckout, setMostrarCheckout] = useState(false);
  const [productoAgregado, setProductoAgregado] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [vistaActual, setVistaActual] = useState('tienda');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const username = localStorage.getItem('username');

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);

  useEffect(() => {
    cargarFavoritos();
  }, [username]);

  useEffect(() => {
    if (productoAgregado) {
      const timer = setTimeout(() => setProductoAgregado(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [productoAgregado]);

  const cargarFavoritos = () => {
    if (username) {
      const favoritosGuardados = JSON.parse(localStorage.getItem(`favoritos_${username}`) || '[]');
      setFavoritos(favoritosGuardados);
    }
  };

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      return existe
        ? prev.map((item) => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)
        : [...prev, { ...producto, cantidad: 1 }];
    });
    setProductoAgregado(producto.id);
  };

  const toggleFavorito = (productoId) => {
    const esFavorito = favoritos.includes(productoId);
    const nuevosFavoritos = esFavorito
      ? favoritos.filter(id => id !== productoId)
      : [...favoritos, productoId];
    setFavoritos(nuevosFavoritos);
    localStorage.setItem(`favoritos_${username}`, JSON.stringify(nuevosFavoritos));
  };

  const actualizarFavoritos = () => {
    // Forzar recarga de favoritos desde localStorage
    cargarFavoritos();
  };

  const cerrarSesion = () => {
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  const abrirModalProducto = (producto) => {
    setProductoSeleccionado(producto);
  };

  const cerrarModalProducto = () => {
    setProductoSeleccionado(null);
  };

  const manejarClicOverlay = (e) => {
    if (e.target === e.currentTarget) {
      cerrarModalProducto();
    }
  };

  const renderVistaActual = () => {
    switch (vistaActual) {
      case 'favoritos':
        return (
          <Favoritos
            onAgregarAlCarrito={agregarAlCarrito}
            favoritos={favoritos}
            onToggleFavorito={toggleFavorito}
            onActualizarFavoritos={actualizarFavoritos}
          />
        );
      case 'historial':
        return <Historial />;
      default:
        return (
          <div className="galeria">
            {productos.map((item) => (
              <div key={item.id} className={`producto ${productoAgregado === item.id ? 'producto-agregado' : ''}`}>
                <div className="producto-imagen-container" onClick={() => abrirModalProducto(item)}>
                  <div className="modelo-overlay">
                    <model-viewer
                      src={item.modelo}
                      alt={item.nombre}
                      auto-rotate
                      camera-controls
                      ar
                      shadow-intensity="1"
                    />
                  </div>
                </div>
                <div className="producto-info">
                  <h2 onClick={() => abrirModalProducto(item)} style={{ cursor: 'pointer' }}>
                    {item.nombre}
                  </h2>
                  <p className="producto-precio">${item.precio.toLocaleString()}</p>
                  <div className="producto-acciones">
                    <button onClick={() => agregarAlCarrito(item)} className="btn-agregar-carrito">
                      Agregar al carrito
                    </button>
                    <button
                      onClick={() => toggleFavorito(item.id)}
                      className={`btn-favorito ${favoritos.includes(item.id) ? 'favorito-activo' : ''}`}
                    >
                      {favoritos.includes(item.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="App">
      <div className="navbar">
        <h1 onClick={() => setVistaActual('tienda')} style={{ cursor: 'pointer' }}>House Center</h1>
        <nav className="navbar-nav">
          <button
            className={`nav-button ${vistaActual === 'tienda' ? 'active' : ''}`}
            onClick={() => setVistaActual('tienda')}
          >
            🏠 Inicio
          </button>
          <button
            className={`nav-button ${vistaActual === 'favoritos' ? 'active' : ''}`}
            onClick={() => setVistaActual('favoritos')}
          >
            ❤️ Favoritos ({favoritos.length})
          </button>
          <button
            className={`nav-button ${vistaActual === 'historial' ? 'active' : ''}`}
            onClick={() => setVistaActual('historial')}
          >
            📋 Historial
          </button>
        </nav>

        <div className="usuario-container">
          <span className="usuario-nombre">¡Hola, {username}!</span>
          <button className="btn-carrito" onClick={() => setMostrarCarrito(!mostrarCarrito)}>
            🛒 {cantidadTotal > 0 && <span className="carrito-contador">{cantidadTotal}</span>}
          </button>
          <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {mostrarCarrito && (
        <Carrito
          carrito={carrito}
          setCarrito={setCarrito}
          onClose={() => setMostrarCarrito(false)}
          onCheckout={() => {
            setMostrarCarrito(false);
            setMostrarCheckout(true);
          }}
        />
      )}

      {mostrarCheckout && (
        <Checkout
          carrito={carrito}
          onVolver={() => {
            setMostrarCheckout(false);
            setCarrito([]); // Limpiar carrito al volver
          }}
        />
      )}

      {productoSeleccionado && (
        <div className="producto-modal-overlay" onClick={manejarClicOverlay}>
          <div className="producto-modal">
            <div className="producto-modal-header">
              <h2>{productoSeleccionado.nombre}</h2>
              <button className="btn-cerrar-modal" onClick={cerrarModalProducto}>✕</button>
            </div>
            <div className="producto-modal-contenido">
              <div className="producto-modal-viewer">
                <model-viewer
                  src={productoSeleccionado.modelo}
                  alt={productoSeleccionado.nombre}
                  auto-rotate
                  camera-controls
                  ar
                  shadow-intensity="1"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div className="producto-modal-info">
                <p className="producto-modal-precio">
                  ${productoSeleccionado.precio.toLocaleString()}
                </p>
                <div className="producto-modal-descripcion-container">
                  <h3>Descripción del producto</h3>
                  <p className="producto-modal-descripcion">{productoSeleccionado.descripcion}</p>
                </div>
                <div className="producto-modal-caracteristicas">
                  <h3>Características destacadas</h3>
                  <ul className="caracteristicas-lista">
                    <li>✅ Visualización 3D interactiva</li>
                    <li>✅ Realidad aumentada compatible</li>
                    <li>✅ Garantía incluida</li>
                    <li>✅ Envío gratuito</li>
                  </ul>
                </div>
                <div className="producto-modal-acciones">
                  <button
                    onClick={() => {
                      agregarAlCarrito(productoSeleccionado);
                      cerrarModalProducto();
                    }}
                    className="btn-agregar-carrito-modal"
                  >
                    Agregar al carrito
                  </button>
                  <button
                    onClick={() => toggleFavorito(productoSeleccionado.id)}
                    className={`btn-favorito-modal ${favoritos.includes(productoSeleccionado.id) ? 'favorito-activo' : ''}`}
                  >
                    {favoritos.includes(productoSeleccionado.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderVistaActual()}
    </div>
  );
}

export default App;
