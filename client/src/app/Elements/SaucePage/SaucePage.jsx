import React, { useEffect } from "react";
import GoodsList from "../../Reusable/GoodsList";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { filterGoods } from "../../../store/goods";

const SaucePage = () => {
    const { pathname } = useLocation();
    const truePathName = pathname.slice(1) + "s";

    const dispatch = useDispatch();

    // В фильтрацию ниже будет включена сортировка путём передачи стейта.
    // Стейт меняется при нажатии на меню сортировки.
    useEffect(() => {
        dispatch(filterGoods(truePathName));
    }, []);

    return <GoodsList pathname={truePathName} />;
};

export default SaucePage;
