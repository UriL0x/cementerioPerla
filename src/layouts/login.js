import { useState, useRef } from "react";
import { login } from "../api/users";
import { setSession } from "../utils/session";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState(false);
    let nameInput = useRef(null);
    let passwordInput = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        let name = nameInput.current.value;
        let password = passwordInput.current.value;
        
        if (password === '' || name === '') {
            setErrors(true);
            return;
        }

        try {
            const res = await login({
                username: name,
                password: password
            });
            console.log(res.data);
            setSession(res.data);
            window.location = '/admin';
        } catch (err) {
            setLoading(false);
            setError(true);
            setMessage(err.request?.data?.error || 'Credenciales invalidas');
        }
    };

    return (
        <>
        <main>
            <section className="container-fluid d-flex flex-column justify-content-center p-4" style={{ width: '400px' }}>
                <form className="container shadow rounded p-3 login">
                    <p className="fw-bold w-100 text-center fs-1 spook-font text-white">Iniciar sesión</p>
                
                    <div className="d-flex justify-content-center">
                        <img src="/media/gravepanel.png"/>
                    </div>
    

                    {/* Nombre */}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Nombre:</label>
                        <input 
                            ref={nameInput} 
                            type="text" 
                            className={`form-control ${errors && nameInput.current.value === '' ? 'is-invalid' : ''}`} 
                            id="username"
                            aria-invalid={error && nameInput.current.value === '' ? 'true' : 'false'}
                        />
                        {errors && nameInput.current.value === '' && (
                            <div className="invalid-feedback">El nombre es obligatorio.</div>
                        )}
                    </div>
                    
                    {/* Contraseña */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña:</label>
                        <input 
                            ref={passwordInput} 
                            type="password" 
                            className={`form-control ${errors && passwordInput.current.value === '' ? 'is-invalid' : ''}`} 
                            id="password"
                            aria-invalid={errors && passwordInput.current.value === '' ? 'true' : 'false'}
                        />
                        {errors && passwordInput.current.value === '' && (
                            <div className="invalid-feedback">La contraseña es obligatoria.</div>
                        )}
                    </div>

                    {/* Mensaje de Error */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {message}
                        </div>
                    )}

                    {/* Botón de envío */}
                    <div className="container-fluid text-end">
                        <button onClick={handleSubmit} type="submit" className="btn btn-primary">
                            {loading ? "ENVIANDO..." : "ENVIAR"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
        </>
    );
}
