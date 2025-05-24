import { useState, useEffect } from 'react';
import './Login.css'; // Reutiliza estilos del login

export function Checkout({ carrito, onVolver }) {
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        ciudad: '',
        telefono: ''
    });

    const username = localStorage.getItem('username');

    // Cargar datos del usuario al inicializar el componente
    useEffect(() => {
        if (username) {
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            const usuarioActual = usuarios.find(user => user.nombre === username);

            if (usuarioActual) {
                setFormData({
                    nombre: usuarioActual.nombre,
                    direccion: usuarioActual.direccion,
                    ciudad: usuarioActual.ciudad,
                    telefono: usuarioActual.telefono
                });
            }
        }
    }, [username]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const iva = total * 0.19;
    const totalConIva = total + iva;
    const fechaHora = new Date().toLocaleString();

    const confirmarCompra = () => {
        // Validar que todos los campos estén completos
        if (Object.values(formData).some(field => field.trim() === '')) {
            alert("⚠️ Por favor completa todos los campos antes de continuar.");
            return;
        }

        // Guardar la compra en el historial
        const compra = {
            id: Date.now(),
            fecha: fechaHora,
            usuario: formData.nombre,
            productos: carrito,
            subtotal: total,
            iva: iva,
            total: totalConIva,
            datosEntrega: {
                direccion: formData.direccion,
                ciudad: formData.ciudad,
                telefono: formData.telefono
            }
        };

        // Obtener historial existente
        const historial = JSON.parse(localStorage.getItem(`historial_${username}`) || '[]');
        historial.push(compra);
        localStorage.setItem(`historial_${username}`, JSON.stringify(historial));

        alert("✅ Compra realizada correctamente.\n\nGracias por tu pedido. Recibirás una confirmación pronto.");
        onVolver(); // Vuelve a la tienda
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Finalizar compra</h1>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre completo</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Tu nombre completo"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="direccion">Dirección</label>
                        <input
                            type="text"
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            placeholder="Dirección de entrega"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ciudad">Ciudad</label>
                        <input
                            type="text"
                            id="ciudad"
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                            placeholder="Ciudad de residencia"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="Número de contacto"
                            required
                        />
                    </div>

                    <hr style={{ margin: '1.5rem 0' }} />

                    <h2>Resumen de compra</h2>
                    <p><strong>Fecha:</strong> {fechaHora}</p>
                    <p><strong>Comprador:</strong> {formData.nombre}</p>
                    <p><strong>Ciudad:</strong> {formData.ciudad}</p>

                    <ul className="resumen-lista">
                        {carrito.map((item) => (
                            <li key={item.id} className="resumen-item">
                                <span>{item.nombre} x{item.cantidad}</span>
                                <span>${(item.precio * item.cantidad).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="resumen-total">
                        <h3>Subtotal: ${total.toLocaleString()}</h3>
                        <h3>IVA (19%): ${Math.round(iva).toLocaleString()}</h3>
                        <h3>Total a pagar: ${Math.round(totalConIva).toLocaleString()}</h3>
                    </div>

                    <button type="button" className="login-button" onClick={confirmarCompra}>
                        Confirmar compra
                    </button>
                    <button
                        type="button"
                        className="btn-volver-tienda"
                        onClick={onVolver}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            marginTop: '1rem',
                            backgroundColor: '#f5f5f5',
                            color: '#666',
                            border: '2px solid #e0e0e0',
                            borderRadius: '10px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}
