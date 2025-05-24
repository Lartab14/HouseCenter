import { useState } from 'react';
import './Login.css'; // Reutilizamos los estilos del login

export function Register({ onRegister, switchToLogin }) {
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        ciudad: '',
        telefono: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (Object.values(formData).some(field => field.trim() === '')) {
            setError('Por favor completa todos los campos');
            return;
        }

        // Validar formato de teléfono (solo números y algunos caracteres especiales)
        const telefonoRegex = /^[\d\s\-\+\(\)]+$/;
        if (!telefonoRegex.test(formData.telefono)) {
            setError('El teléfono solo puede contener números, espacios, guiones y paréntesis');
            return;
        }

        // Verificar si el usuario ya existe
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        if (usuarios.find(user => user.nombre === formData.nombre)) {
            setError('El nombre de usuario ya existe');
            return;
        }

        // Guardar usuario
        const nuevoUsuario = {
            id: Date.now(),
            nombre: formData.nombre,
            direccion: formData.direccion,
            ciudad: formData.ciudad,
            telefono: formData.telefono,
            fechaRegistro: new Date().toISOString()
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('username', formData.nombre);

        onRegister();
    };

    return (
        <div className="login-container">
            <div className="login-image">
                <div className="overlay">
                    <h1 className="welcome-text">Únete a House Center</h1>
                    <p className="welcome-description">¡Crea tu cuenta y descubre nuestros productos para hacer de tu casa un hogar!</p>
                </div>
            </div>
            <div className="login-card">
                <h1>House Center</h1>
                <h2>Crea tu cuenta</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre de usuario</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Tu nombre de usuario"
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
                            placeholder="Tu dirección completa"
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
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Crear cuenta
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <span style={{ color: '#666' }}>¿Ya tienes cuenta? </span>
                        <button
                            type="button"
                            onClick={switchToLogin}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#4caf50',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}