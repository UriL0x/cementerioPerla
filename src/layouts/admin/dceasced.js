import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "../../api/users.js";
import { EditDceascedModal } from "../../components/dceasced/editDceasced.js";
import { AddDeceasedModal } from "../../components/dceasced/addDceasced.js";
import { faSkull } from "@fortawesome/free-solid-svg-icons";
import DeleteBtn from "../../components/deleteBtn.js";
import { deleteDceasced, getAllDceasced, getAllDocs } from "../../api/dceasced.js";
import Header from "../header.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { DocumentsModal, ReportModal } from "../../components/modals.js";
import { checkSession } from "../../utils/session.js";
import { ChargeCircle, NoData } from "../../components/charge.js";
import { InfoModal } from "../../components/modals.js";
import { Modal } from 'bootstrap';

export function DceascedPanel() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [docs, setDocs] = useState([])
    const [loading, setLoading] = useState(true);
    const [showInfoModal, setShowInfoModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllDceasced();
                console.log(res.data)
                setData(res.data.dceasced);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };
        fetchData();

        const getDocs = async () => {
            try {
                const response = await getAllDocs()
                setDocs(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error al obtener documentos:", error);
            }
        }
        getDocs()
        
    }, []);

    const handleReportClick = () => {
    if (data.length === 0) {
        setShowInfoModal(true);
            const modal = new Modal(document.getElementById("infoModal"));
            modal.show();
        } else {
            // Abre el modal de reporte como normalmente
            const modal = new Modal(document.getElementById("reportModal"));
            modal.show();
        }
    };

    if (!checkSession()) {
        window.location = "/";
        return;
    }

    const filteredUsers = data.filter((d) =>
        d.dceasced.name?.toLowerCase().includes(search.toLowerCase())
    );

    const modals = data.map((d) => (
        <EditDceascedModal key={`modal-${d.dceasced.id}`} dceased={d.dceasced} />
    ));

    const docModals = data.map((d) => (
        <DocumentsModal idModal={`docsDceasced${d.dceasced.id}`} dceasced={d} />
    ));

    return (
        <div className="">
            <Header />
            <main className="container py-4">
                <section className="card bounce-right">
                    <div className="card-body">
                        <h2 className="card-title h4 mb-4 text-white fs-2 spook-font">Administrar difuntos</h2>

                        {/* Acciones */}
                        <div className="container-fluid d-flex flex-wrap justify-content-between mb-3">
                            <div>
                                <img src="/media/skull3.png" className="icon-panel"/>
                            </div>
                            <div>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleReportClick}
                                >
                                    Generar reporte
                                </button>
                                <button
                                    className="btn btn-primary ms-3"
                                    data-bs-toggle="modal"
                                    data-bs-target="#addDeceasedModal"
                                >
                                    Agregar difunto +
                                </button>
                                <AddDeceasedModal />
                            </div>
                        </div>

                        {/* Tabla */}
                        <div className="table-responsive">
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Buscar difunto por nombre..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />          
                                {loading ? (<div>
                                    <ChargeCircle/>
                                </div>): (         
                                <table className="table table-bordered table-striped">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Apellidos</th>
                                            <th>Fecha de nacimiento</th>
                                            <th>Fecha de defunción</th>
                                            <th>Locacion</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((d) => (
                                            <tr key={d.dceasced.id}>
                                                <td>{d.dceasced.name}</td>
                                                <td>{d.dceasced.second_name}</td>
                                                <td>{d.dceasced.date_of_born}</td>
                                                <td>{d.dceasced.date_of_death}</td>
                                                <td>{d.dceasced.location}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-success me-2"
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#docsDceasced${d.dceasced.id}`}
                                                    >
                                                        Ver documentos asociados
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#editDceascedModal${d.dceasced.id}`}
                                                    >
                                                        Editar
                                                    </button>
                                                    <DeleteBtn deleteFunction={deleteDceasced} id={d.dceasced.id} />
                                                </td>
                                            </tr>
                                        ))}
                                        {data.length == 0 && <tr>
                                            <td colSpan="6" className="text-center">
                                                <NoData message={"No hay difuntos registrados"}/>
                                            </td>
                                        </tr>}
                                    </tbody>
                                </table>)}
                            
                            {modals}
                            {docModals}
                        </div>
                        
                        {/* Modales */}
                        <InfoModal title={"Advertencia"} idModal={"infoModal"} message={"No hay difuntos registrados para generar un reporte"}/>
                        <ReportModal idModal="reportModal" dataList={data.dceasced}/>
                    </div>
                </section>
            </main>
        </div>
    );
}
