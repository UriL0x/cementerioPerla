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
    const [filters, setFilters] = useState({
        num: "",
        row: "",
        section: "",
        block: ""
    });
    const [data, setData] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllGraves();
                setData(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };

        const getBlocks = async () => {
            try {
                const res = await getAllBlocks();
                setBlocks(res.data);
            } catch (error) {
                console.error("Error al obtener bloques:", error);
            }
        };

        fetchData();
        getBlocks();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const filteredData = data.filter((d) =>
        String(d.num).includes(filters.num) &&
        String(d.location?.row || "").toLowerCase().includes(filters.row.toLowerCase()) &&
        String(d.location?.section || "").toLowerCase().includes(filters.section.toLowerCase()) &&
        String(d.location?.block || "").toLowerCase().includes(filters.block.toLowerCase())
    );

    const editModal = data.map((grave) => (
        <EditGraveModal key={`modal-${grave.id}`} grave={grave} blocks={blocks} />
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
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                            <div className="">
                                <h2 className="text-white fs-2 spook-font mb-3">Administrar tumbas</h2>
                                <img src="/media/grave1.png" className="icon-panel" alt="icono" />
                            </div>
                            <button
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target={"#addGraveModal"}
                            >
                                Agregar tumbas +
                            </button>
                        </div>


                        {loading ? (
                            <ChargeCircle />
                        ) : (
                            <div className="table-responsive">
                                <div className="d-flex  gap-3 mb-3">
                                    <input
                                        type="text"
                                        name="num"
                                        className="form-control"
                                        placeholder="Buscar por número"
                                        value={filters.num}
                                        onChange={handleFilterChange}
                                    />
                                    <input
                                        type="text"
                                        name="row"
                                        className="form-control"
                                        placeholder="Buscar por fila"
                                        value={filters.row}
                                        onChange={handleFilterChange}
                                    />
                                    <input
                                        type="text"
                                        name="section"
                                        className="form-control"
                                        placeholder="Buscar por cuadro"
                                        value={filters.section}
                                        onChange={handleFilterChange}
                                    />
                                    <input
                                        type="text"
                                        name="block"
                                        className="form-control"
                                        placeholder="Buscar por manzana"
                                        value={filters.block}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                <table className="table table-bordered table-striped">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Número</th>
                                            <th>Estado</th>
                                            <th>Locación</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((grave) => (
                                            <tr key={grave.id}>
                                                <td>{grave.num}</td>
                                                <td>{grave.is_busy ? "Ocupada" : "Libre"}</td>
                                                <td>{`Fila ${grave.location?.row || "?"}, Cuadro ${grave.location?.section || "?"}, Manzana ${grave.location?.block || "?"}`}</td>
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
                                        {filteredData.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    <NoData message={"No hay tumbas que coincidan con los filtros"} />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {editModal}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}