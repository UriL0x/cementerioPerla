import Header from "../header";
import { Card } from "../../components/cards";
import { checkPrivileges } from "../../utils/session";
import { useEffect, useState } from "react";
import { checkSession } from "../../utils/session";

export default function AdminPanel() {
    const [showElements, setShowElements] = useState(false);
    const [showBats, setShowBats] = useState(true);

    // Mostrar murcielagos durante 10 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowBats(false);
        },  900);
        return () => clearTimeout(timer);
    }, []);

    // Mover desde la izquierda calabazas
    useEffect(() => {
        if (!showBats) {
            setShowElements(true);
        }
    }, [showBats]);

    
    if (!checkSession()) {
        window.location = "/";
        return;
    }

    return (
        <>
            <Header/>
            <main className="p-2 text-center">
                <section className="container-fluid main-page-content d-flex flex-wrap justify-content-center gap-4 p-4">
                    <Card title={'Administrar Difuntos'} page={'/admin/difuntos'} icon={<img className="icon" src="/media/skull3.png"/>}/>
                    <Card title={'Administrar Tumbas'} page={'/admin/tumbas'} icon={<img className="icon" src="/media/grave1.png"/>}/>
                    <Card title={'Administrar Ubicaciones'} page={'/admin/ubicaciones'} icon={<img className="icon" src="/media/church2.svg"/>}/>
                    {checkPrivileges() && <Card title={'Administrar Usuarios'} page={'/admin/usuarios'} icon={<img className="icon" src="/media/death.png"/>}/>}
                </section>
                {showBats && <img className="bats" src="/media/gif/bats.gif"/>}
            </main>
            <img className="web1" src="/media/web1.png"/>
            <footer>
                {showElements && 
                <>
                    <img className={`pumpkins ${showElements ? 'left-pump' : ''}`} src="/media/pumpkins.png"/>
                    <img className={`pumpkins1 ${showElements ? 'left-pump' : ''}`} src="/media/pumpkins.png"/>
                    <img className={`pumpkins2 ${showElements ? 'left-pump' : ''}`} src="/media/pumpkins.png"/>
                </>
                }
            </footer>
        </>
    );
}