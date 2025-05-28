import { updateUserPrivileges } from "../../api/users";
import { closeSession } from "../../utils/session";

export function AscendUser({idModal, user}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const sendData = async () => {
            try {
                await updateUserPrivileges(user);
                closeSession();
                window.location.href = '/iniciar_sesion';
            } catch (error) {}
        };
        sendData();
    };
    
    return (
        <div
            className="modal fade"
            id={idModal}
            tabIndex="-1"
            aria-labelledby="addDeceasedModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-sm">
                <form onSubmit={handleSubmit} className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmar ascenso</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Seguro que quiere ascender a <strong>{user.username}</strong>?, usted perdera los privilegios de asministrador y pasara a ser un operador.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-success">
                                Aceptar
                            </button>
                        </div>
                </form>
            </div>
        </div>
    );
}