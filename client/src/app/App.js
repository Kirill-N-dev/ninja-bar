import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Favicon from "react-favicon";
import favicon from "../media/favicon/32384pizza_98934.svg";
import routes from "../routes/Routes";
import { useRoutes, useLocation } from "react-router";
import NavBar from "../app/Navbar/NavBar";
import Footer from "./Footer/Footer";
import WithStyles from "./HOC/WithStyles";
import WithAppLoader from "./HOC/WithAppLoader";
import Upper from "./Upper/Upper";
import WithThemes from "./HOC/WithThemes";

function App() {
    const location = useLocation();
    const elements = useRoutes(routes(location));

    return (
        <>
            <WithThemes>
                <Favicon url={favicon} />
                <NavBar />
                <WithAppLoader>
                    <WithStyles elements={elements}></WithStyles>
                </WithAppLoader>
                <Upper />
                <Footer />
                <ToastContainer />
            </WithThemes>
        </>
    );
}

export default App;
