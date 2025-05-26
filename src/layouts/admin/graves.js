import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "../../api/users.js";
import { EditGraveModal } from "../../components/grave/editGrave.js";
import { AddDeceasedModal } from "../../components/dceasced/addDceasced.js";
import { faUser, faCross } from "@fortawesome/free-solid-svg-icons";
import DeleteBtn from "../../components/deleteBtn.js";
import { deleteDceasced, getAllDceasced } from "../../api/dceasced.js";
import { deleteGraves, getAllGraves } from "../../api/graves.js";
import { AddGraveModal } from "../../components/grave/addGrave.js";
import Header from "../header.js";
import { getAllBlocks } from "../../api/locations.js";
import { checkSession } from "../../utils/session.js";
import { ChargeCircle, NoData } from "../../components/charge.js";

export default function GravesPanel() {
    const [data, setData] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllGraves();
                console.log(res.data);
                setData(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };
        fetchData();

        const getBlocks = async () => {
            try {
                const res = await getAllBlocks();
                console.log(res.data);
                setBlocks(res.data);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };
        getBlocks();
    }, []);

    let editModal = data.map((grave) => (
        <EditGraveModal key={`modal-${grave.id}`} grave={grave} blocks={blocks}/>
    ));

    if (!checkSession()) {
        window.location = '/';
        return;
    }

    return (
        <div>
            <Header />
            <main className="container py-4">
                <section className="card bounce-right">
                    <div className="card-body">
                        <h2 className="card-title h4 mb-4 text-white fs-2 spook-font">Administrar tumbas</h2>

                        {/* Acciones: Agregar */}
                        <div className="container-fluid d-flex flex-wrap justify-content-between mb-3">
                            <div className="">
                                <img src="/media/grave1.png" className="icon-panel"/>
                            </div>
                            <div className="">
                                <button
                                    className="btn btn-primary ms-3"
                                    data-bs-toggle="modal"
                                    data-bs-target={"#addGraveModal"}
                                >
                                    Agregar tumbas +
                                </button>
                                <AddGraveModal blocks={blocks}/>
                            </div>
                        </div>
  
                        {loading ? 
                                (<div>
                                    <ChargeCircle/>
                                </div>): (  
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                            <thead className="table-light">
                                <tr>
                                    <th>Número</th>
                                    <th>Estado</th>
                                    <th>Fila</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((grave) => (
                                    <tr key={grave.id}>
                                        <td>{grave.num}</td>
                                        <td>{grave.is_busy ? "Ocupada" : "Libre"}</td>
                                        <td>{grave.row?.num || "No tiene fila"}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                data-bs-toggle="modal"
                                                data-bs-target={`#editGraveModal${grave.id}`}
                                            >
                                                Editar
                                            </button>
                                            <DeleteBtn deleteFunction={deleteGraves} id={grave.id} />
                                        </td>
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            <NoData message={"No hay tumbas registradas"}/>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                            {/* Modales para editar */}
                            {editModal}
                        </div>)}
                    </div> 
                </section>
            </main>
        </div>
    );
}
