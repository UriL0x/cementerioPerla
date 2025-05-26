import { useState, useEffect } from "react";
import { faChurch, faL, faTrash } from "@fortawesome/free-solid-svg-icons";
import { addBlock, deleteBlock, getAllBlocks } from "../../api/locations.js";
import { BlockModal } from "../../components/locations/modalBlock.js";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddBlock } from "../../components/locations/addBlock.js";
import { checkSession } from "../../utils/session.js";
import Header from "../header.js";
import { ChargeCircle, NoData } from "../../components/charge.js";
import DeleteBtn from "../../components/deleteBtn.js";

export default function LocationsPanel() {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getAllBlocks();
                setBlocks(response.data); 
                console.log(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener los bloques:", error);
            }
        };
        getData();
    }, []);
    
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
                        <h2 className="card-title h4 mb-4 text-white fs-2 spook-font">Administrar ubicaciones</h2>

                        {/* Acciones: Agregar */}
                        <div className="container-fluid d-flex flex-wrap justify-content-between mb-3">
                            <div className="">
                                <img src="/media/church2.svg" className="icon-panel"/>
                            </div>
                            <div className="">
                                <button
                                    className="btn btn-primary ms-3"
                                    data-bs-toggle="modal"
                                    data-bs-target="#addBlockModal"
                                >
                                    Agregar Manzana +
                                </button>
                                <AddBlock/>
                            </div>
                        </div>
                        {loading ? (<div>
                                    <ChargeCircle/>
                                </div>): ( 
                        <div className="container-fluid blocks-container">
                            <section className="d-flex flex-wrap justify-content-center gap-4 p-4">
                                {blocks.map((block) => (
                                    <div
                                        key={block.id}
                                        className="card shadow-sm"
                                        style={{ width: '10rem' }}
                                    >
                                        <div className="block-card text-center">
                                            <img src="/media/church.png"/>

                                            <div className="content">
                                                <h5 className="card-title pb-2">Manzana {block.num}</h5>
                                                <div className="d-flex justify-content-end gap-2 p-2">
                                                    <DeleteBtn deleteFunction={deleteBlock} icon={<FontAwesomeIcon icon={faTrash}/>} outline={true} id={block.id}/>
                                                    <button
                                                        className="btn btn-sm btn-primary me-2"
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#blockModal${block.id}`}
                                                    >
                                                        <FontAwesomeIcon icon={faInfo}/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {blocks.length == 0 && (
                                        <div className="text-center">
                                            <NoData message={"No hay manzanas registradas"}/>
                                        </div>
                                )}
                            </section>

                            {/* Modales para editar */}
                            {blocks.map((block) => (
                                <BlockModal block={block} />
                            ))}
                        </div>)}
                    </div>
                </section>
            </main>
        </div>
    );
}

