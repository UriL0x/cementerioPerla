import { useEffect, useState } from "react";
import { editGrave } from "../../api/graves.js";
import { NoData } from "../charge.js";

export function EditGraveModal({ grave, blocks }) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showLocationsInputs, setshowLocationsInputs] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [showInputs, setShowInputs] = useState(false);
    const [noContent, setNoContent] = useState(null);

    const [sections, setSections] = useState([]);
    const [rows, setRows] = useState([]);

    // Campos a rellenar
    const [numBlock, setNumBlock] = useState(null);
    const [numSection, setNumSection] = useState(null);
    const [numRow, setNumRow] = useState(null);
    const [numGrave, setNumGrave] = useState("");

    const [isBusy, setIsBusy] = useState(false);
    const [num, setNumero] = useState("");
    const [row, setRow] = useState("");
    const [numeroError, setNumeroError] = useState("");

    useEffect(() => {
        setIsBusy(!!grave.is_busy); 
        setNumero(grave.num || "");
        setRow(grave.row);
        setNumRow(grave.row.num);
    }, [grave]);

    const isNumericInput = (value) => /^[0-9]+$/.test(value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación: número debe ser obligatorio y numérico
        if (!num || !isNumericInput(num)) {
            setNumeroError("Ingrese un número válido.");
            return;
        }

        const formData = new FormData();
        formData.append("is_busy", isBusy ? "true" : "false");
        formData.append("num", num);
        formData.append("row", numRow);
        // Enviar la nueva info en caso de que halla cambios
        if (numBlock) {
            formData.append("section", numSection);
            formData.append("block", numBlock);   
        }

        try {
            setLoading(true);
            await editGrave(grave.id, formData);
            window.location.reload();
        } catch (err) {
            console.error("Error al actualizar:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setShowInputs(true);
        let currentSections = [];
        blocks.forEach((block) => {
            if (Number(block.num) === Number(numBlock)) {
                currentSections = block.sections || [];
            }
        });
        setSections(currentSections);
    }, [numBlock]);

    useEffect(() => {
        setShowInputs(true);
        let currentRow = [];
        sections.forEach((section) => {
            if (Number(section.num) === Number(numSection)) {
                currentRow = section.rows || [];
            }
        });
        setRows(currentRow);
    }, [numSection]);

    return (
        <div
            className="modal fade"
            id={"editGraveModal" + grave.id}
            tabIndex="-1"
            aria-labelledby="editGraveModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="editGraveModalLabel">Editar Tumba</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            {/* Campo número */}
                            <div className="mb-3">
                                <label className="form-label">Número</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={num}
                                    onChange={(e) => {setNumero(e.target.value)}}
                                />
                                {numeroError && (
                                    <div className="text-danger mt-1">{numeroError}</div>
                                )}
                            </div>

                            {/* Campo ocupada */}
                            <div className="form-check mb-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`isBusyCheck${grave.id}`}
                                    checked={isBusy}
                                    onChange={(e) => setIsBusy(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor={`isBusyCheck${grave.id}`}>
                                    Ocupada
                                </label>
                            </div>

                            {/* Campo Ubicación */}
                            <div className="mb-3">
                                {!showLocationsInputs ? (
                                    <div>
                                        <label className="form-label">Fila (haga click si desea cambiarla de ubicación)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={row.num}
                                            placeholder={row.num}
                                            onClick={() => setshowLocationsInputs(true)}
                                            readOnly
                                        />
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                        <div>
                                            <label className="form-label mt-3">Número de manzana</label>
                                            <select
                                                className="form-control"
                                                onChange={(e) => setNumBlock(e.target.value)}
                                            >
                                                <option value="">Seleccione una manzana disponible</option>
                                                {blocks.map((block) => (
                                                    <option key={block.num} value={block.num}>
                                                        {block.num}
                                                    </option>
                                                ))}
                                            </select>
                                            {numBlock && sections.length === 0 && (
                                                <div className="alert alert-warning mt-2">
                                                    Esa manzana no tiene cuadros disponibles.
                                                </div>
                                            )}
                                        </div>

                                        {sections.length > 0 && (
                                            <div>
                                                <label className="form-label mt-3">Número de cuadro</label>
                                                <select
                                                    className="form-control"
                                                    onChange={(e) => setNumSection(e.target.value)}
                                                >
                                                    <option value="">Seleccione un cuadro disponible</option>
                                                    {sections.map((section) => (
                                                        <option key={section.num} value={section.num}>
                                                            {section.num}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {rows.length > 0 && (
                                            <div>
                                                <label className="form-label mt-3">Número de fila</label>
                                                <select
                                                    className="form-control"
                                                    onChange={(e) => setNumRow(e.target.value)}
                                                >
                                                    <option value="">Seleccione una fila disponible</option>
                                                    {rows.map((row) => (
                                                        <option key={row.num} value={row.num}>
                                                            {row.num}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="alert alert-danger">
                                    Error al guardar los cambios.
                                </div>
                            )}
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
