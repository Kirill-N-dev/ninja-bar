import React from "react";

const Loader = () => {
    return (
        <div className="align-items-center justify-content-center flex-grow-1 d-flex flex-column h-100">
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Загрузка...</span>
            </div>
        </div>
    );
};

export default Loader;
