/* 
    Este componente es para registrar 
    una tumba en el cementerio 
*/

import { useEffect, useState } from "react";
import { addGrave } from "../../api/graves.js";
import { getAllBlocks } from "../../api/locations";

export function AddGraveModal({ blocks }) {
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showInputs, setShowInputs] = useState(false);
    const [sections, setSections] = useState([]);
    const [rows, setRows] = useState([]);
    const [noSections, setNoSections] = useState(false); 

    // Campos a rellenar
    const [numBlock, setNumBlock] = useState(null);
    const [numSection, setNumSection] = useState(null);
    const [numRow, setNumRow] = useState(null);
    const [num, setNum] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!numBlock) newErrors.numBlock = "Debe seleccionar una manzana.";
        if (!numSection) newErrors.numSection = "Debe seleccionar un cuadro.";
        if (!numRow) newErrors.numRow = "Debe seleccionar una fila.";

        if (!num.trim()) {
            newErrors.num = "Debe ingresar el número de tumba.";
        } else if (!/^\d+$/.test(num.trim())) {
            newErrors.num = "Solo se permiten números.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const graveData = {
            num,
            row: numRow,
            section: numSection,
            block: numBlock,
            is_busy: '',
        };

        try {
            setLoading(true);
            const response = await addGrave(graveData);
            console.log(response.data);
            window.location.reload();
        } catch (err) {
            console.error("Error al enviar:", err);
            setError(true);
            setErrorMessage(err.response?.data?.error || "Algo salió mal, inténtelo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    // Actualiza secciones cuando cambia manzana
    useEffect(() => {
        setShowInputs(true);
        let currentSections = [];

        blocks.forEach((block) => {
            if (Number(block.num) === Number(numBlock)) {
                currentSections = block.sections;
            }
        });

        setSections(currentSections);
        setNumSection(null);
        setNumRow(null);
        setRows([]);

        if (currentSections.length === 0 && numBlock) {
            setNoSections(true);
        } else {
            setNoSections(false);
        }

    }, [numBlock]);

    // Actualiza filas cuando cambia sección
    useEffect(() => {
        setShowInputs(true);
        let currentRows = [];

        sections.forEach((section) => {
            if (Number(section.num) === Number(numSection)) {
                currentRows = section.rows;
            }
        });

        setRows(currentRows);
        setNumRow(null);
    }, [numSection]);

    return (
        <div
            className="modal fade"
            id="addGraveModal"
            tabIndex="-1"
            aria-labelledby="addGraveModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="addGraveModalLabel">Agregar Tumba</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">

                            {/* Manzana */}
                            <label className="form-label mt-3">Número de manzana</label>
                            <select
                                className={`form-control ${errors.numBlock ? "is-invalid" : ""}`}
                                onChange={(e) => setNumBlock(e.target.value)}
                            >
                                <option value="">Seleccione una manzana disponible</option>
                                {blocks.map((block) => (
                                    <option key={block.num} value={block.num}>{block.num}</option>
                                ))}
                            </select>
                            {errors.numBlock && (
                                <div className="invalid-feedback">{errors.numBlock}</div>
                            )}

                            {/* Alerta si no hay secciones */}
                            {noSections && (
                                <div className="alert alert-warning mt-2">
                                    Esa manzana no tiene cuadros disponibles.
                                </div>
                            )}

                            {/* Cuadro */}
                            {sections.length > 0 && (
                                <>
                                    <label className="form-label mt-3">Número de cuadro</label>
                                    <select
                                        className={`form-control ${errors.numSection ? "is-invalid" : ""}`}
                                        onChange={(e) => setNumSection(e.target.value)}
                                    >
                                        <option value="">Seleccione un cuadro disponible</option>
                                        {sections.map((section) => (
                                            <option key={section.num} value={section.num}>{section.num}</option>
                                        ))}
                                    </select>
                                    {errors.numSection && (
                                        <div className="invalid-feedback">{errors.numSection}</div>
                                    )}
                                </>
                            )}

                            {/* Fila */}
                            {rows.length > 0 && (
                                <>
                                    <label className="form-label mt-3">Número de fila</label>
                                    <select
                                        className={`form-control ${errors.numRow ? "is-invalid" : ""}`}
                                        onChange={(e) => setNumRow(e.target.value)}
                                    >
                                        <option value="">Seleccione una fila disponible</option>
                                        {rows.map((row) => (
                                            <option key={row.num} value={row.num}>{row.num}</option>
                                        ))}
                                    </select>
                                    {errors.numRow && (
                                        <div className="invalid-feedback">{errors.numRow}</div>
                                    )}
                                </>
                            )}

                            {/* Número de tumba */}
                            <label className="form-label mt-3">Número de Tumba</label>
                            <input
                                type="text"
                                className={`form-control ${errors.num ? "is-invalid" : ""}`}
                                value={num}
                                onChange={(e) => setNum(e.target.value)}
                                placeholder="Ingrese el número que llevará la tumba"
                            />
                            {errors.num && (
                                <div className="invalid-feedback">{errors.num}</div>
                            )}

                            {error && (
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
                                {loading ? "Guardando..." : "Guardar Tumba"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
