
export function Card({title, page, icon}) {
    return (
        <a  href={[page]} class="  border-0 text-center card-panel">
            <img src="/media/cloud.png"/>
            <div class="content">
                {icon}
                <h5 class="card-title fw-bold spook-font text-white">{title}</h5>
            </div>
        </a>
    );
}

export function CardBlock({title, page}) {
    return (
        <div className="card card-panel" style={{ width: "18rem" }}>
        <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">
            </p>
            <div className="text-end">
                <a href={page} className="btn btn-primary">
                administrar
                </a>
            </div>
        </div>
        </div>
    );
}