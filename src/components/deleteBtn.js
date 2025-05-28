/* 
    Aqui esta el boton de eliminar,
    ya sea un muerto, usuario, etc,
    recibe como parametro una funcion para
    hacerla llamada a la api y el otro es el id.
*/

import { Modal } from 'bootstrap';
import { useRef, useState } from "react";

export default function DeleteBtn({ deleteFunction, id, icon="eliminar", outline=false}) {
    const confirmModalRef = useRef(null);
    const resultModalRef = useRef(null);
    const resultTextRef = useRef(null);
    const [error, setError] = useState(null);

    const showModal = (ref) => {
        const modal = new Modal(ref.current);
        modal.show();
    };

    const handleDeleteClick = () => {
        showModal(confirmModalRef);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteFunction(id);
            resultTextRef.current.textContent = "✅ Eliminado exitosamente.";
        } catch (error) {
            setError(true);
            resultTextRef.current.textContent = "❌ Error al eliminar.";
        } finally {
            showModal(resultModalRef);
        }
    };

    return (
        <>
            <button className={`btn btn-sm ${outline ? 'btn-danger' : 'btn-outline-danger'}`} onClick={handleDeleteClick}>
                {icon}
            </button>

            {/* Modal de confirmación */}
            <div className="modal fade" id="confirmModal" ref={confirmModalRef} tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmar eliminación</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <p>¿Estás seguro de eliminar este elemento?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de resultado */}
            <div className="modal fade" id="resultModal" ref={resultModalRef} tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{error ? "Error" : "Mensaje"}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <p ref={resultTextRef}></p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary"
                            onClick={() => {
                                if (!error) {
                                window.location.reload();
                                }
                            }}
                            data-bs-dismiss="modal">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


