import { useState } from "react";
import { register } from "../../api/users";

export function AddUserModal() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!username.trim()) newErrors.username = "El nombre es obligatorio.";
        if (!password.trim()) newErrors.password = "La contraseña es obligatoria.";
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const userData = {
            username,
            password,
            is_admin: "operador"
        };

        try {
            setLoading(true);
            const response = await register(userData);
            console.log(response.data)
            window.location.reload()  
        } catch (err) {
            console.error("Error al enviar:", err);
            setError(true)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="modal fade"
            id="addUserModal"
            tabIndex="-1"
            aria-labelledby="addUserModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="addUserModalLabel">Agregar Usuario</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Nombre de usuario</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Ej: admin123"
                                />
                                {errors.username && (
                                    <div className="invalid-feedback">{errors.username}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Contraseña</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="********"
                                />
                                {errors.password && (
                                    <div className="invalid-feedback">{errors.password}</div>
                                )}
                            </div>
                                   
                            {error && <div className="container-fluid alert alert-danger mt-3">
                                Algo salio mal, intentelo de nuevo
                                </div>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar Usuario"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
