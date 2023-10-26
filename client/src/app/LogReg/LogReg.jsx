import React from "react";
import RegisterForm from "./RegisterForm/RegisterForm";
import LoginForm from "./LoginForm/LoginForm";
import { Navigate, useParams } from "react-router";
/* import { getIsLoggedIn } from "../../../store/users"; */

const LogReg = () => {
    const { reg } = useParams();

    if (reg === undefined) {
        return <LoginForm />;
    }
    if (reg === "reg") {
        return <RegisterForm />;
    }

    if (reg !== "reg" && reg !== undefined) {
        return <Navigate to="../" />;
    }
};

export default LogReg;
