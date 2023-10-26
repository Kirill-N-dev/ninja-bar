import React, { useEffect } from "react";
import GoodsList from "../../Reusable/GoodsList";
import { useLocation } from "react-router";
import { filterGoods } from "../../../store/goods";
import { useDispatch } from "react-redux";

const PizzaPage = () => {
    // Тут был лодер, но он в AppLoader - в зависимости от экшена подгрузки товаров
    const { pathname } = useLocation(); // полный путь типа "/pizza"
    const truePathName = pathname.slice(1) + "s"; // "pizzas"

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(filterGoods(truePathName));
        console.log("случился Эффект");
    }, []);

    // передаю строки типа "pizzas"
    return <GoodsList pathname={truePathName} />;
};

export default PizzaPage;
