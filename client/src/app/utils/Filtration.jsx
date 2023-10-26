import React from "react";
import PropTypes from "prop-types";

const Filtration = ({ onClick, goodsPathName }) => {
    // Ниже отключаю отображение фильтрации на тематических страницах
    return (
        <div className={goodsPathName ? "d-none" : " d-flex"}>
            <div className="mx-2 mx-sm-3 mx-md-3 mx-lg-3 mx-xl-4 mx-xxl-4">
                <label onClick={(ev) => onClick(ev, "pizzas")}>Пиццы</label>
            </div>
            <div className="me-2 me-sm-3 me-md-3 me-lg-3 me-xl-4 me-xxl-4">
                <label onClick={(ev) => onClick(ev, "drinks")}>Напитки</label>
            </div>
            <div className="">
                <label onClick={(ev) => onClick(ev, "sauces")}>Соусы</label>
            </div>
        </div>
    );
};

Filtration.propTypes = {
    onClick: PropTypes.func,
    goodsPathName: PropTypes.string
};

export default Filtration;
