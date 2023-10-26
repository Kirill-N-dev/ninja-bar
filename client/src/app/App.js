import React from "react";
/* import { useLocation  useRoutes  } from "react-router-dom"; */
import { ToastContainer } from "react-toastify";
/* import withRedux from "./hoc/withRedux";
import withRouter from "./hoc/withRouter"; */
import "react-toastify/dist/ReactToastify.css";
import Favicon from "react-favicon";
import favicon from "../media/favicon/32384pizza_98934.svg";
import routes from "../routes/Routes";
import { useRoutes, useLocation } from "react-router";
/* import { useSelector } from "react-redux"; */
/* import { isLoggedInSelector } from "./store/authSlice"; */
import NavBar from "../app/Navbar/NavBar";
import Footer from "./Footer/Footer";
import WithStyleWrapper from "./HOC/WithStyleWrapper";
import AppLoader from "./HOC/AppLoader";
import Upper from "./Upper/Upper";
/* import { useSelector } from "react-redux"; */

function App() {
    //
    document.title = "Ninja bar"; // снова обращение к дому. Я не знаю, как делать это в реакте.

    /* const isLoggedIn = useSelector(isLoggedInSelector()); */
    /* const elements = useRoutes(routes(isLoggedIn, location)); */
    const location = useLocation();
    const elements = useRoutes(routes(location));

    // Структуру папок сделал подобной структуре выдачи App.js
    return (
        <>
            <Favicon url={favicon} />
            <NavBar />
            <AppLoader>
                <WithStyleWrapper elements={elements} />
            </AppLoader>
            <Upper />
            <Footer />

            <ToastContainer />
        </>
    );
}
/* const AppWithStoreAndRoutes = withRedux(withRouter(App));
export default AppWithStoreAndRoutes; */
export default App;
