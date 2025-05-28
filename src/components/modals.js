/* 
En este archivo hay algunos modales 
que hacen un poco de todo
*/

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf"; 
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import { deleteDoc, getAllDceasced, uploadDoc } from "../api/dceasced";
import { API_ROUTE } from "../utils/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NoData } from "./charge";

export function InfoModal({idModal, message, title, action}) {
    return (
        <div
            className="modal fade"
            id={idModal}
            tabIndex="-1"
            aria-labelledby="addDeceasedModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-sm">
                <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                        </div>
                        <div className="modal-body">
                            <p>{message}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={() => action} className="btn btn-success" data-bs-dismiss="modal">
                                Aceptar
                            </button>
                        </div>
                </div>
            </div>
        </div>
    );
}

export function DocumentsModal({ idModal, dceasced }) {
    const [docs, setDocs] = useState([]);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (dceasced.docs) {
            setDocs(dceasced.docs);
        }
    }, [dceasced]);

    const handleDelete = async (idDoc) => {
        try {
            await deleteDoc(idDoc);
            setDocs(prev => prev.filter(doc => doc.id !== idDoc));
        } catch (err) {
            setError("Error al eliminar documento.");
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Selecciona un archivo.");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('dceasced', dceasced.dceasced.id); 
            formData.append('route', file);

            const response = await uploadDoc(formData);
            setDocs(prev => [...prev, response.data.doc]);
            setFile(null);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Error al subir el documento.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className="modal fade"
            id={idModal}
            tabIndex="-1"
            aria-labelledby="addDeceasedModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-md">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Documentos asociados</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {docs.length === 0 ? (
                            <NoData message="El difunto no tiene documentos registrados"/>
                        ) : (
                            <ul className="list-unstyled">
                                {docs.map(doc => (
                                    <li
                                        key={doc.id}
                                        className="d-flex justify-content-between gap-3 align-items-center p-1 mb-2 doc-container"
                                    >
                                        <a className="p-0 rounded p-1"
                                            href={`http://${API_ROUTE}${doc.route}`}
                                        >
                                            Documento (click para descargar) {}
                                        </a>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(doc.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-3 border-top pt-2">
                            <label className="form-label spook-font text-white fs-4">Agregar nuevo documento</label>
                            <input
                                className="form-control"
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <div className="text-end">
                                <button
                                    className="btn btn-success mt-2"
                                    onClick={handleUpload}
                                    disabled={uploading}
                                >
                                    {uploading ? "Subiendo..." : "Subir documento"}
                                </button>
                            </div>
                            {error && <div className="alert alert-danger mt-2">{error}</div>}
                        </div>
                    </div>
                    <div className="modal-footer"></div>
                </div>
            </div>
        </div>
    );
}

export function ReportModal({ idModal }) {
    const [format, setFormat] = useState("");
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);
    const [exportPerDates, setExportPerDates] = useState(false);
    const [exportAllData, setExportAllData] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dateError, setDateError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllDceasced();
                setData(res.data.dceasced);
                console.log(res.data)
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };
        fetchData();    
    }, []);

    const handleChange = (e) => {
        setFormat(e.target.value);
        if (error) setError(false);
    };

    const handleGenerate = () => {
        if (format === "") {
            setError(true);
            return;
        }

        if (exportPerDates && (!startDate || !endDate)) {
            setDateError(true);
            return;
        }

        setDateError(false);

        // Filtrar data en caso de que sea por fechas
        let filteredData = data;
        if (exportPerDates) {
            filteredData = data.filter(d => {
                const date = new Date(d.dceasced.date_of_death);
                return date >= new Date(startDate) && date <= new Date(endDate);
            });
        }

        if (format === 'pdf') {
            const doc = new jsPDF();
            const rows = filteredData.map((d) => {
                let grave = d.dceasced.grave ? d.dceasced.grave.num : null;
                return [
                    grave,
                    d.dceasced.name,
                    d.dceasced.second_name,
                    d.dceasced.date_of_born,
                    d.dceasced.date_of_death
                ];
            });

            doc.text("Reporte", 20, 20);
            autoTable(doc, {
                head: [['Tumba', 'Nombre', 'Apellidos', 'Fecha de nacimiento', 'Fecha de fallecimiento']],
                body: rows,
                startY: 30,
                theme: "striped",
                headStyles: { fillColor: [22, 160, 133] },
            });
            doc.save("reporte.pdf");

        } else if (format === 'excel') {
            const rows = filteredData.map((d) => {
                let grave = d.dceasced.grave ? d.dceasced.grave.num : null;
                return {
                    Tumba: grave,
                    Nombre: d.dceasced.name,
                    Apellidos: d.dceasced.second_name,
                    Fecha_nacimiento: d.dceasced.date_of_born,
                    Fecha_fallecimiento: d.dceasced.date_of_death
                };
            });

            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de difuntos");
            XLSX.writeFile(workbook, "reporte.xlsx");
        }
    };

    return (
        <div className="modal fade" id={idModal} tabIndex="-1" aria-labelledby="reportModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-sm">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="reportModalLabel">Elija el formato</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>

                    <div className="modal-body">
                        <select className={`form-select ${error ? 'is-invalid' : ''}`} onChange={handleChange} value={format}>
                            <option value="">Seleccionar formato</option>
                            <option value="pdf">PDF</option>
                            <option value="excel">Excel</option>
                        </select>
                        {error && <div className="invalid-feedback">Seleccione un formato válido</div>}

                        <div className="mt-3">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    checked={exportAllData}
                                    onChange={(e) => setExportAllData(e.target.checked)}
                                    className="form-check-input"
                                    id="exportAll"
                                />
                                <label htmlFor="exportAll" className="form-check-label">Reporte Completo</label>
                            </div>

                            <div className="form-check mt-1">
                                <input
                                    type="checkbox"
                                    checked={exportPerDates}
                                    onChange={(e) => setExportPerDates(e.target.checked)}
                                    className="form-check-input"
                                    id="exportByDate"
                                />
                                <label htmlFor="exportByDate" className="form-check-label">Por rango de fechas</label>
                            </div>

                            {exportPerDates && (
                                <div className="mt-3">
                                    <input
                                        type="date"
                                        className={`form-control ${dateError && !startDate ? 'is-invalid' : ''}`}
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        className={`form-control mt-2 ${dateError && !endDate ? 'is-invalid' : ''}`}
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                    {dateError && <div className="invalid-feedback d-block">Debe ingresar ambas fechas</div>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={handleGenerate} className="btn btn-success">
                            Generar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
