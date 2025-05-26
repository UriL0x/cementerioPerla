import { useState, useEffect } from "react";
import { updateUser } from "../../api/users";

export function EditUserModal({ user}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setUsername(user.username || ""); 
        setIsAdmin(user.is_admin)
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedUser = {
            id: username.id,
            username: username,
            password: password || user.password,
            is_admin: isAdmin ? "true" : "false",
        };

        try {
            setLoading(true);
            await updateUser(user.id, updatedUser);
            window.location.reload();
        } catch (err) {
            console.error("Error al actualizar:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="modal fade"
            id={"editUserModal" + user.id}
            tabIndex="-1"
            aria-labelledby="editUserModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="editUserModalLabel">Editar Usuario</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Nombre de usuario</label>
                                <input
                                    type="text"
                                    className='form-control'
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Contraseña (dejar en  blanco si no se cambia)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="container-fluid alert alert-danger mt-3">
                                    Algo salió mal, intenta de nuevo.
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
