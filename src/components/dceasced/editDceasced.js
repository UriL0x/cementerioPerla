import { useState, useEffect } from "react";
import { addDceased, deleteDoc, editDceased } from "../../api/dceasced";
import { API_ROUTE } from "../../utils/config";

export function EditDceascedModal({ dceased }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [deathDate, setDeathDate] = useState("");
    const [grave, setGrave] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(dceased)
        setFirstName(dceased.name || "");
        setLastName(dceased.second_name || "");
        setBirthDate(dceased.date_of_born || "");
        setDeathDate(dceased.date_of_death || "");
        setGrave(dceased.grave?.num || "no tiene tumba");
    }, [dceased]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", firstName);
        formData.append("second_name", lastName);
        formData.append("date_of_born", birthDate);
        formData.append("date_of_death", deathDate);
        formData.append('grave', grave);

        try {
            setLoading(true);
            await editDceased(dceased.id, formData);
            window.location.reload();
        } catch (err) {
            console.error("Error al actualizar:", err);
            setError(true);
            setErrorMessage(err.response?.data?.error || "Algo salió mal, inténtelo de nuevo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="modal fade"
            id={"editDceascedModal" + dceased.id}
            tabIndex="-1"
            aria-labelledby="editDeceasedModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="editDeceasedModalLabel">Editar información de Fallecido</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            {/* Nombre y apellidos */}
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input type="text" className="form-control" value={firstName} placeholder={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Apellidos</label>
                                <input type="text" className="form-control" value={lastName} placeholder={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>

                            {/* Fechas */}
                            <div className="mb-3">
                                <label className="form-label">Fecha de nacimiento</label>
                                <input type="date" className="form-control" value={birthDate} placeholder={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Fecha de defunción</label>
                                <input type="date" className="form-control" value={deathDate} placeholder={deathDate} onChange={(e) => setDeathDate(e.target.value)} />
                            </div>

                            {/* Tumba */}
                            <div className="mb-3">
                                <label className="form-label">Tumba</label>
                                <input type="text" className="form-control" value={grave} placeholder={grave} onChange={(e) => setGrave(e.target.value)} />
                            </div>

                            {/* Errores */}
                            {error && <div className="mb-3">
                                <div className="alert alert-danger">
                                    Algo salio mal, intentelo de nuevo
                                </div>
                            </div>}

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}