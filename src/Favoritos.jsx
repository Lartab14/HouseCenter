import { useState, useEffect } from 'react';
import '@google/model-viewer';
import { productos } from './data';
import './Favoritos.css';
export function Favoritos({ onAgregarAlCarrito, favoritos, onToggleFavorito, onActualizarFavoritos }) {
    const [productosFavoritos, setProductosFavoritos] = useState([]);

    useEffect(() => {
        // Filtrar productos basados en los favoritos del estado principal
        const productosFiltrados = productos.filter(producto =>
            favoritos.includes(producto.id)
        );
        setProductosFavoritos(productosFiltrados);
    }, [favoritos]);

    const quitarDeFavoritos = (id) => {
        // Usar la función del componente padre para mantener sincronización
        onToggleFavorito(id);
        // Notificar al padre que se actualizó la lista
        if (onActualizarFavoritos) {
            onActualizarFavoritos();
        }
    };

    const agregarAlCarrito = (producto) => {
        onAgregarAlCarrito(producto);
    };

    if (productosFavoritos.length === 0) {
        return (
            <div className="favoritos-vacio">
                <div className="favoritos-vacio-contenido">
                    <div className="favoritos-icono">❤️</div>
                    <h2>No tienes productos favoritos</h2>
                    <p>Explora nuestra tienda y agrega productos a tus favoritos para verlos aquí</p>
                </div>
            </div>
        );
    }

    return (
        <div className="favoritos-container">
            <div className="favoritos-header">
                <h1>Mis Favoritos ❤️</h1>
                <p>{productosFavoritos.length} producto{productosFavoritos.length !== 1 ? 's' : ''} guardado{productosFavoritos.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="galeria">
                {productosFavoritos.map((producto) => (
                    <div key={producto.id} className="producto favorito-item">
                        <div className="producto-imagen-container">
                            <div className="modelo-overlay">
                                <model-viewer
                                    src={producto.modelo}
                                    alt={producto.nombre}
                                    auto-rotate
                                    camera-controls
                                    ar
                                    shadow-intensity="1"
                                />
                            </div>
                        </div>

                        <div className="producto-info">
                            <h2>{producto.nombre}</h2>
                            <p className="producto-descripcion">{producto.descripcion}</p>
                            <p className="producto-precio">${producto.precio.toLocaleString()}</p>

                            <div className="producto-acciones">
                                <button
                                    onClick={() => agregarAlCarrito(producto)}
                                    className="btn-agregar-carrito"
                                >
                                    Agregar al carrito
                                </button>
                                <button
                                    onClick={() => quitarDeFavoritos(producto.id)}
                                    className="btn-quitar-favorito"
                                >
                                    💔 Quitar de favoritos
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}