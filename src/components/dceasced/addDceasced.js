import { useState } from "react";
import { addDceased } from "../../api/dceasced";

export function AddDeceasedModal() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [deathDate, setDeathDate] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [grave, setGrave] = useState("");
    const [errors, setErrors] = useState({});
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [dragging, setDragging] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!firstName.trim()) newErrors.firstName = "Este campo es requerido";
        if (!lastName.trim()) newErrors.lastName = "Este campo es requerido";
        if (!deathDate) newErrors.deathDate = "Este campo es requerido";
        if (!birthDate) newErrors.birthDate = "Este campo es requerido";
        if (!grave) {
            newErrors.grave = "Este campo es requerido";
        } else if (isNaN(grave) || !Number.isInteger(Number(grave))) {
            newErrors.grave = "Debe ser un número válido";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const formData = new FormData();
        formData.append("name", firstName);
        formData.append("second_name", lastName);
        formData.append("date_of_death", deathDate);
        formData.append("date_of_born", birthDate);
        formData.append("grave", grave);
        if (files.length > 0) {
            files.forEach((doc) => {
                formData.append("documents", doc);
            });
        }

        try {
            setLoading(true);
            const response = await addDceased(formData);
            console.log(response.data);
            window.location.reload();
        } catch (err) {
            console.error("Submission error:", err);
            setHasError(true);
            setErrorMessage(err.response?.data?.error || "Algo salió mal, inténtelo de nuevo");
        } finally {
            setLoading(false);
        }
    };


    // Manejo de carga de archivos
    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        
        const droppedFiles = Array.from(event.dataTransfer.files);
        setFiles(prev => [...prev, ...droppedFiles]);
        console.log('Archivos recibidos:', droppedFiles);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDragEnter = () => setDragging(true);
    const handleDragLeave = () => setDragging(false);

    return (
        <div
            className="modal fade"
            id="addDeceasedModal"
            tabIndex="-1"
            aria-labelledby="addDeceasedModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="addDeceasedModalLabel">Registrar difunto</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Apellidos</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Fecha de cumpleaños</label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.birthDate ? "is-invalid" : ""}`}
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                />
                                {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Fecha de defunción</label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.deathDate ? "is-invalid" : ""}`}
                                    value={deathDate}
                                    onChange={(e) => setDeathDate(e.target.value)}
                                />
                                {errors.deathDate && <div className="invalid-feedback">{errors.deathDate}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Número de tumba</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.grave ? "is-invalid" : ""}`}
                                    value={grave}
                                    onChange={(e) => setGrave(e.target.value)}
                                />
                                {errors.grave && <div className="invalid-feedback">{errors.grave}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Documentos a registrar</label>
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    className="drop rounded text-center"
                                    onClick={() => document.getElementById('hiddenFileInput').click()}
                                >
                                    <p>{dragging ? "Suelta los archivos aquí" : "Arrastra y suelta tus archivos aquí o haz clic para seleccionar"}</p>
                                </div>

                                <input
                                    id="hiddenFileInput"
                                    type="file"
                                    multiple
                                    onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
                                    style={{ display: 'none' }}
                                />

                                <p className="mt-2 fw-bold">Documentos cargados ({files.length})</p>
                            </div>

                            {hasError && (
                                <div className="alert alert-danger mt-3">
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading ? "Registrando..." : "Registrar difunto"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
