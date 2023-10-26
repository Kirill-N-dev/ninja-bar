import React from "react";
import AboutUs from "../app/Elements/AboutUs/AboutUs";
import Actions from "../app/Elements/Actions/Actions";
import PizzaPage from "../app/Elements/PizzaPage/PizzaPage";
import SaucePage from "../app/Elements/SaucePage/SaucePage";
import DrinkPage from "../app/Elements/DrinkPage/DrinkPage";
import LoginForm from "../app/LogReg/LoginForm/LoginForm";
import { Navigate, Outlet } from "react-router";
/* import RegisterForm from "../app/Elements/LogReg/RegisterForm/RegisterForm"; */
import LogReg from "../app/LogReg/LogReg";
import Cart from "../app/Elements/Cart/Cart";
import PersonalData from "../app/Elements/PersonalData/PersonalData";
import MainPage from "../app/MainPage/MainPage";
import GoodsPage from "../app/Reusable/GoodsPage";
import Administration from "../app/Administration/Administration";
import GoodsEdit from "../app/Administration/GoodsEdit/GoodsEdit";
import GoodsCreate from "../app/Administration/GoodsCreate/GoodsCreate";
import SellerOrders from "../app/Administration/SellerOrders/SellerOrders";
import UserOrders from "../app/User/UserOrders/UserOrders";

// location пока без применения
const Routes = (location) => [
    {
        path: "",
        element: <MainPage />
    },
    {
        path: "/about",
        element: <AboutUs />
    },
    {
        path: "/action",
        element: <Actions />
    },
    {
        path: "/pizza",
        element: <Outlet />,
        children: [
            { path: ":id", element: <GoodsPage /> },
            { path: "", element: <PizzaPage /> }
        ]
    },
    {
        path: "/sauce",
        element: <Outlet />,
        children: [
            { path: ":id", element: <GoodsPage /> },
            { path: "", element: <SaucePage /> }
        ]
    },
    {
        path: "/drink",
        element: <Outlet />,
        children: [
            { path: ":id", element: <GoodsPage /> },
            { path: "", element: <DrinkPage /> }
        ]
    },
    {
        path: "/logreg",
        element: <Outlet />,
        children: [
            {
                path: "",
                element: <LogReg />
            },
            {
                path: ":reg",
                element: <LogReg />
            }
        ]
    },
    {
        path: "/login",
        element: <LoginForm />
    },
    {
        path: "/cart",
        element: <Cart />
    },
    {
        path: "/personal",
        element: <PersonalData />
    },
    {
        path: "/user",
        element: <Outlet />,
        children: [
            { path: "", element: <MainPage /> },
            { path: "orders", element: <UserOrders /> },
            { path: "*", element: <Navigate to="" /> }
        ]
    },
    {
        path: "/admin",
        element: <Outlet />,
        children: [
            { path: "", element: <Administration /> },
            { path: "create", element: <GoodsCreate /> },
            { path: "orders", element: <SellerOrders /> },
            { path: "*", element: <Navigate to="/admin" /> },
            {
                path: "edit",
                element: <Outlet />,
                children: [
                    { path: "", element: <Navigate to="/admin" /> },
                    { path: ":gid", element: <GoodsEdit /> }
                ]
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="" />
    }
];

export default Routes;
