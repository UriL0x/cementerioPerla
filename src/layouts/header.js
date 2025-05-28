import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { checkPrivileges, closeSession } from '../utils/session';
import { Link } from 'react-router-dom';

export default function Header() {
    if (!checkPrivileges) {
        window.location.href = '/';
    }

    return (
        <header className='d-flex justify-content-between align-items-center'>
            <div className='d-flex align-items-center'>
                <img className='grave-header' src='/media/grave.png' alt=''/>
                <p className='fs-1 fw-bold creepster-font'>Panteon perla la paz</p>
            </div>
            <nav>
                <ul id='nav-pc' className='pt-2'>
                    <div className='d-flex p-3 gap-3 nav-header'>
                        <li><Link to="/admin">Pagina principal</Link></li>
                        <li><Link to="/admin/difuntos">Difuntos</Link></li>
                        <li><Link to="/admin/tumbas">Tumbas</Link></li>
                        <li><Link to="/admin/ubicaciones">Locaciones</Link></li>
                        {checkPrivileges() && <li><Link to="/admin/usuarios">Usuarios</Link></li>}
                        <li><Link to="/" onClick={closeSession}>Cerrar sesión</Link></li>
                    </div>
                </ul>
                <button class="btn btn-primary me-3 spook-font" id='nav-mobile' type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    <FontAwesomeIcon className='fs-1' icon={faBars}/>
                </button>

                <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                    <div class="offcanvas-header">
                        <h3 class="offcanvas-title spook-font" id="offcanvasExampleLabel">Menu de navegacion</h3>
                        <button type="button" class="btn-close fs-2" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <div class="mt-2">
                            <ul className='d-flex flex-column justify-content-center align-items-start gap-4'>
                                <li><Link to="/admin">Pagina principal</Link></li>
                                <li><Link to="/admin/difuntos">Difuntos</Link></li>
                                <li><Link to="/admin/tumbas">Tumbas</Link></li>
                                <li><Link to="/admin/ubicaciones">Locaciones</Link></li>
                                <li><Link to="/admin/usuarios">Usuarios</Link></li>
                                <li><Link to="/" onClick={closeSession}>Cerrar sesión</Link></li>
                            </ul>

                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}