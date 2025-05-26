export function ChargeCircle() {
    return (
        <>
            <div className="w-100 text-center">
                <img className="spookie-dance" src="/media/spookiedance.gif"/>
                <p className="spook-font d-flex justify-content-center text-white fs-1">
                    <p className="me-2">Cargando info</p>
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                </p>
            </div>
        </>
    );
}

export function NoData({message}) {
    return (
        <>
            <div className="w-100 text-center">
                <img className="spookie-dance" src="/media/skull.webp"/>
                <p className="spook-font d-flex justify-content-center text-white fs-1">
                    <p className="me-2">{message}</p>
                </p>
            </div>
        </>
    );
}