import { useState, useEffect } from 'react';

export function Historial() {
    const [historial, setHistorial] = useState([]);
    const [compraSeleccionada, setCompraSeleccionada] = useState(null);
    const username = localStorage.getItem('username');

    useEffect(() => {
        cargarHistorial();
    }, [username]);

    const cargarHistorial = () => {
        if (username) {
            const historialGuardado = JSON.parse(localStorage.getItem(`historial_${username}`) || '[]');
            // Ordenar por fecha más reciente
            const historialOrdenado = historialGuardado.sort((a, b) => b.id - a.id);
            setHistorial(historialOrdenado);
        }
    };

    const verDetalleCompra = (compra) => {
        setCompraSeleccionada(compra);
    };

    const cerrarDetalle = () => {
        setCompraSeleccionada(null);
    };

    if (historial.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: '#666'
            }}>
                <h2>📋 Historial de Compras</h2>
                <p style={{ fontSize: '1.2rem', marginTop: '2rem' }}>
                    Aún no has realizado ninguna compra.
                </p>
                <p>¡Explora nuestros productos y realiza tu primera compra!</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
                📋 Historial de compras
            </h2>

            <div style={{
                display: 'grid',
                gap: '1.5rem',
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))'
            }}>
                {historial.map((compra) => (
                    <div
                        key={compra.id}
                        style={{
                            backgroundColor: 'white',
                            border: '2px solid #e0e0e0',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onClick={() => verDetalleCompra(compra)}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '1rem'
                        }}>
                            <div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                                    Compra #{compra.id.toString().slice(-6)}
                                </h3>
                                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                    {compra.fecha}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{
                                    margin: 0,
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: '#4caf50'
                                }}>
                                    ${Math.round(compra.total).toLocaleString()}
                                </p>
                                <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>
                                    Total
                                </p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                                <strong>Productos:</strong> {compra.productos.length} artículo{compra.productos.length !== 1 ? 's' : ''}
                            </p>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#777' }}>
                                {compra.productos.slice(0, 2).map((producto, index) => (
                                    <span key={index}>
                                        {producto.nombre} x{producto.cantidad}
                                        {index < Math.min(compra.productos.length, 2) - 1 ? ', ' : ''}
                                    </span>
                                ))}
                                {compra.productos.length > 2 && (
                                    <span> y {compra.productos.length - 2} más...</span>
                                )}
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '1rem',
                            borderTop: '1px solid #f0f0f0'
                        }}>
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                📍 {compra.datosEntrega.ciudad}
                            </span>
                            <span style={{
                                fontSize: '0.8rem',
                                color: '#4caf50',
                                fontWeight: 'bold'
                            }}>
                                Ver detalles →
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de detalle de compra */}
            {compraSeleccionada && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        padding: '2rem',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80%',
                        overflow: 'auto',
                        position: 'relative'
                    }}>
                        <button
                            onClick={cerrarDetalle}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: '#666'
                            }}
                        >
                            ✕
                        </button>

                        <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
                            Detalle de compra #{compraSeleccionada.id.toString().slice(-6)}
                        </h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <p><strong>Fecha:</strong> {compraSeleccionada.fecha}</p>
                            <p><strong>Cliente:</strong> {compraSeleccionada.usuario}</p>
                            <p><strong>Dirección:</strong> {compraSeleccionada.datosEntrega.direccion}</p>
                            <p><strong>Ciudad:</strong> {compraSeleccionada.datosEntrega.ciudad}</p>
                            <p><strong>Teléfono:</strong> {compraSeleccionada.datosEntrega.telefono}</p>
                        </div>

                        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Productos</h3>
                        <div style={{
                            backgroundColor: '#f9f9f9',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem'
                        }}>
                            {compraSeleccionada.productos.map((producto) => (
                                <div
                                    key={producto.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.5rem 0',
                                        borderBottom: '1px solid #e0e0e0'
                                    }}
                                >
                                    <span>{producto.nombre} x{producto.cantidad}</span>
                                    <span>${(producto.precio * producto.cantidad).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            backgroundColor: '#f0f8ff',
                            padding: '1rem',
                            borderRadius: '8px',
                            borderLeft: '4px solid #4caf50'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Subtotal:</span>
                                <span>${compraSeleccionada.subtotal.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>IVA (19%):</span>
                                <span>${Math.round(compraSeleccionada.iva).toLocaleString()}</span>
                            </div>
                            <hr style={{ margin: '0.5rem 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                <span>Total:</span>
                                <span style={{ color: '#4caf50' }}>
                                    ${Math.round(compraSeleccionada.total).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}