// src/Carrito.jsx
import React from 'react';

export function Carrito({ carrito, setCarrito, onClose, onCheckout }) {
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const remover = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const aumentarCantidad = (id) => {
    setCarrito(carrito.map(item =>
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
    ));
  };

  const disminuirCantidad = (id) => {
    setCarrito(carrito.map(item =>
      item.id === id && item.cantidad > 1
        ? { ...item, cantidad: item.cantidad - 1 }
        : item
    ).filter(item => !(item.id === id && item.cantidad === 1)));
  };

  const finalizarCompra = () => {
    onCheckout(); // Llama a la vista de datos del comprador
  };

  return (
    <div className="carrito-overlay">
      <div className="carrito-modal">
        <div className="carrito-header">
          <h2>Tu carrito</h2>
          <button className="btn-cerrar" onClick={onClose}>✕</button>
        </div>

        {carrito.length === 0 ? (
          <p className="carrito-vacio">Tu carrito está vacío</p>
        ) : (
          <>
            <ul className="carrito-lista">
              {carrito.map((item) => (
                <li key={item.id} className="carrito-item">
                  <div className="item-info">
                    <span className="item-nombre">{item.nombre}</span>
                    <span className="item-precio">${item.precio.toLocaleString()}</span>
                  </div>
                  <div className="item-controles">
                    <div className="cantidad-control">
                      <button onClick={() => disminuirCantidad(item.id)}>-</button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => aumentarCantidad(item.id)}>+</button>
                    </div>
                    <span className="item-subtotal">${(item.precio * item.cantidad).toLocaleString()}</span>
                    <button className="btn-remover" onClick={() => remover(item.id)}>❌</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="carrito-footer">
              <h3 className="carrito-total">Total: ${total.toLocaleString()}</h3>
              <button className="btn-comprar" onClick={finalizarCompra}>
                Finalizar compra
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
