import { useState } from "react";
import { addBlock } from "../../api/locations";

export function AddBlock() {
    const [num, setNum] = useState("");
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!num.trim()) {
            newErrors.num = "El número es obligatorio.";
        } else if (!/^\d+$/.test(num.trim())) {
            newErrors.num = "Debe ingresar solo números.";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            setLoading(true);
            const response = await addBlock({ num: num });
            console.log(response.data);
            window.location.reload();
        } catch (err) {
            console.error("Error al enviar:", err);
            setError(true);
            setErrorMessage(err.response?.data?.error || "Algo salió mal, inténtelo de nuevo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade" id="addBlockModal" tabIndex="-1" aria-labelledby="addGraveModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="addGraveModalLabel">Agregar Manzana</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="numero" className="form-label">Número de manzana</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.num ? "is-invalid" : ""}`}
                                    id="numero"
                                    value={num}
                                    onChange={(e) => setNum(e.target.value)}
                                    placeholder=""
                                />
                                {errors.num && (
                                    <div className="invalid-feedback">{errors.num}</div>
                                )}
                            </div>

                            {error && (
                                <div className="alert alert-danger mt-2">
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar Manzana"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
