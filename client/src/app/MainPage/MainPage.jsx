import React, { useEffect, useState } from "react";
/* import { useLocation } from "react-router"; */
import GoodsList from "../Reusable/GoodsList";
import { useDispatch } from "react-redux";
import { filterGoods } from "../../store/goods";

const MainPage = () => {
    //
    const [sortBy, setSortBy] = useState(undefined);
    /* const { pathname } = useLocation();
    const truePathName = pathname.slice(1) + "s"; */
    const truePathName = undefined;

    const dispatch = useDispatch();
    // Стейт меняется при нажатии на меню сортировки.
    useEffect(() => {
        dispatch(filterGoods(truePathName, sortBy));
        setSortBy(undefined);
    }, []);

    return <GoodsList setSortBy={setSortBy} pathname={truePathName} />;
};

export default MainPage;
