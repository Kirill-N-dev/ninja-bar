import React, { useEffect } from "react";
import GoodsList from "../../Reusable/GoodsList";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { filterGoods } from "../../../store/goods";

const DrinkPage = () => {
    const { pathname } = useLocation();
    const truePathName = pathname.slice(1) + "s";

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(filterGoods(truePathName));
        console.log("случился Эффект");
    }, []);

    return <GoodsList pathname={truePathName} />;
};

export default DrinkPage;
