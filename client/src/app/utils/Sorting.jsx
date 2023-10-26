import React from "react";
import PropTypes from "prop-types";

const Sorting = ({ onClick, children }) => {
    return (
        <div className="d-flex container-xl mt-1 mt-sm-2 mt-md-2 mt-lg-2 mt-xl-3 mt-xxl-4">
            <div
                className="me-3 me-sm-3 me-md-3 me-lg-3 me-xl-4 me-xxl-4"
                data-name="expensive"
            >
                <label className="cursor" onClick={(ev) => onClick(ev)}>
                    Дороже
                </label>
            </div>
            <div className="me-2" data-name="cheaper">
                <label className="cursor" onClick={(ev) => onClick(ev)}>
                    Дешевле
                </label>
            </div>
            {children}
        </div>
    );
};

Sorting.propTypes = {
    onClick: PropTypes.func,
    setSortBy: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default Sorting;
