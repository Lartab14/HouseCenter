import { useState } from 'react';
import { Register } from './Registro';
import './Login.css';

export function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mostrarRegistro, setMostrarRegistro] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validación simple
        if (username.trim() === '' || password.trim() === '') {
            setError('Por favor completa todos los campos');
            return;
        }

        // Verificar si el usuario existe
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuarioEncontrado = usuarios.find(user => user.nombre === username);

        if (!usuarioEncontrado) {
            setError('Usuario no encontrado. ¿Deseas crear una cuenta?');
            return;
        }

        localStorage.setItem('username', username);
        onLogin();
    };

    const handleRegistroExitoso = () => {
        setMostrarRegistro(false);
        onLogin(); // Redirigir directamente a la tienda después del registro
    };

    if (mostrarRegistro) {
        return (
            <Register
                onRegister={handleRegistroExitoso}
                switchToLogin={() => setMostrarRegistro(false)}
            />
        );
    }

    return (
        <div className="login-container">
            <div className="login-image">
                <div className="overlay">
                    <h1 className="welcome-text">Bienvenido a House Center</h1>
                    <p className="welcome-description">Tu tienda de muebles y decoración</p>
                </div>
            </div>
            <div className="login-card">
                <h1>House Center</h1>
                <h2>Iniciar Sesión</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ingresa tu nombre de usuario"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            style={{ color: '#333' }}
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Iniciar Sesión
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <span style={{ color: '#666' }}>¿No tienes cuenta? </span>
                        <button
                            type="button"
                            onClick={() => setMostrarRegistro(true)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#4caf50',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            ¡Crea tu cuenta!
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}