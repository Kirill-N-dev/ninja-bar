import React from "react";
import PropTypes from "prop-types";
const SearchStatus = ({ length }) => {
    //

    const lastCount = +String(length)[String(length).length - 1];
    const penCount = +String(length)[String(length).length - 2];
    let tusa;
    if (lastCount === 1 && penCount !== 1) tusa = " тусанёт";
    else tusa = " тусанут";
    let man;
    if (
        (lastCount === 2 || lastCount === 3 || lastCount === 4) &&
        penCount !== 1
    ) {
        man = " человека";
    } else man = " человек";

    if (length !== 0) {
        return (
            <div className="d-flex justify-content-center">
                <div className="p-2 m-1 fs-6 badge bg-primary">
                    {length} {man} {tusa} с тобой сегодня
                </div>
            </div>
        );
    } else {
        return (
            <div className="d-flex justify-content-center">
                <div className="p-2 m-1 fs-6 badge bg-danger">
                    Никто с тобой не тусанёт
                </div>
            </div>
        );
    }
};

SearchStatus.propTypes = {
    length: PropTypes.number
};

export default SearchStatus;
