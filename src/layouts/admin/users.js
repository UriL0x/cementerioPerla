import { useEffect, useState } from "react";
import Header from "../header";
import { AddUserModal } from "../../components/users/addModal.js";
import { getAllUsers, deleteUser } from "../../api/users.js";
import { EditUserModal } from "../../components/users/editUser.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { InfoModal, ReportModal } from "../../components/modals.js";
import { checkSession, getDataOfSession } from "../../utils/session.js";
import { AscendUser } from "../../components/modals/ascendUser.js";
import { ChargeCircle, NoData } from "../../components/charge.js";
import DeleteBtn from "../../components/deleteBtn.js";

export function UsersPanel() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response.data);
            } catch (err) {
                console.error("Error al obtener usuarios:", err);
            } finally {
                setLoading(false);  
            }
        };
        getData();
    }, []);

    if (!checkSession()) {
        window.location = '/';
        return;
    }

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    let modalsUsers = users.map(user => (
        <EditUserModal key={user.id} user={user} />
    ));

    let currentUser = getDataOfSession();

    return (
        <>
            <Header />
            <main className="container py-4">
                <section className="card shadow bounce-right">
                    <div className="card-body">
                        <h2 className="card-title h4 mb-4 text-white fs-2 spook-font">Panel de usuarios</h2>

                        <div className="container-fluid d-flex flex-wrap justify-content-between mb-3">
                            <div>
                                <img src="/media/death.png" className="icon-panel" />
                            </div>
                            <div>
                                <button
                                    className="btn btn-primary ms-3"
                                    data-bs-toggle="modal"
                                    data-bs-target="#addUserModal"
                                >
                                    Agregar Usuario + 
                                </button>
                            </div>
                        </div>

                        {/* Tabla de Usuarios */}
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead className="table-light">
                                    <tr>
                                        <th>Nombre de Usuario</th>
                                        <th>Rol</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="3" className="text-center">
                                                <ChargeCircle/>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="text-center">
                                                <NoData message="No hay usuarios registrados" />
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.username === currentUser.username ? "yo" : user.username}</td>
                                                <td>{user.is_admin ? "Administrador" : "Operador"}</td>
                                                <td>
                                                    {!user.is_admin && (
                                                        <button
                                                            className="btn btn-sm btn-outline-success me-2"
                                                            data-bs-toggle="modal"
                                                            data-bs-target={`#ascendUser${user.id}`}
                                                        >
                                                            Volver administrador
                                                        </button>
                                                    )}
                                                    <AscendUser idModal={`ascendUser${user.id}`} user={user} />
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#editUserModal${user.id}`}
                                                    >
                                                        Editar
                                                    </button>
                                                    {!user.is_admin == true && <DeleteBtn deleteFunction={deleteUser} id={user.id}/>}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Modales */}
                    {modalsUsers}
                    <AddUserModal idModal="addUserModal" />
                </section>
            </main>
        </>
    );
}