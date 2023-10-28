import React, { useRef } from "react";
import img from "../logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserData, getCurrentUserId } from "../../store/users";
import PersonalArea from "../PersonalAria/PersonalArea";
import { loadGoods } from "../../store/goods";
import { Tooltip as ReactTooltip } from "react-tooltip";

const NavBar = () => {
    //
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedInUser = useSelector(getCurrentUserId());

    const navRef = useRef(null);

    // Функция не защищена логикой фильтрации повторяющихся id, т.к эта логика должна быть у меня на сервере
    const currentUserCart = useSelector(getCurrentUserData()).cart?.length;

    const user = useSelector(getCurrentUserData());

    // Для условного рендера элементов навбара
    const isSeller = user.isSeller;

    // Эта функция нужна, чтобы при возвращении на майнпагу подгружались, как и должно быть на старте, все товары
    const handleGoToMain = () => {
        dispatch(loadGoods());
    };

    // Установка темы. Тут удалось уйти от дома, просто повесил онклик родителю.
    const handleThemeChanger = (ev) => {
        if (localStorage.getItem("theme") !== "dark") {
            document.documentElement.setAttribute("data-bs-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-bs-theme");
            localStorage.removeItem("theme");
        }
    };

    // Объект для итерации (когда-то я это ненавидел))
    const headerList = [
        { label: "Пицца", path: "/pizza" },
        { label: "Напитки", path: "/drink" },
        { label: "Соусы", path: "/sauce" },
        { label: "Акции", path: "/action" },
        { label: "О нас", path: "/about" }
    ];

    return (
        <nav
            className="navbar navbar-expand-xl bg-body-tertiary sticky-xl-top"
            id="navbar"
            ref={navRef}
        >
            <div className="container-fluid">
                <NavLink
                    to="/"
                    className="navbar-brand"
                    onClick={() => handleGoToMain()}
                >
                    <img
                        src={img}
                        alt="Logo"
                        width="100"
                        height="80"
                        className="d-inline-block align-text-center me-2"
                    />
                    <b>НИНДЗЯ БАР</b>
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarTogglerDemo02"
                    aria-controls="navbarTogglerDemo02"
                    aria-expanded="false"
                    aria-label="Переключатель навигации"
                    id="BuggedButton"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse"
                    id="navbarTogglerDemo02"
                >
                    <div className="container-fluid d-flex justify-content-center">
                        <ul className="navbar-nav">
                            {headerList.map((i) => {
                                return (
                                    <li
                                        className="nav-item d-flex justify-content-center"
                                        key={i.path}
                                    >
                                        <NavLink
                                            to={i.path}
                                            className="nav-link navbar-brand me-0 mx-2"
                                        >
                                            <p>{i.label}</p>
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="container d-flex justify-content-center">
                        <ul className="navbar-nav">
                            {isSeller && (
                                <>
                                    <li className="nav-item me-xl-3">
                                        <div className="px-0 nav-link d-flex justify-content-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="30"
                                                height="30"
                                                fill="currentColor"
                                                className="bi bi-currency-dollar cursor"
                                                viewBox="0 0 16 16"
                                                data-tooltip-id="my-tooltip-multiline"
                                                data-tooltip-html="Данный раздел находится в разработке.<br/>Здесь будет реализована сущность заказов."
                                                /* onClick={() => {
                                                navigate("/admin/orders");
                                            }} */
                                            >
                                                <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z" />
                                            </svg>
                                        </div>
                                    </li>

                                    <li className="nav-item me-xl-3">
                                        <div className="px-0 nav-link d-flex justify-content-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="30"
                                                height="30"
                                                fill="currentColor"
                                                className="bi bi-plus-square cursor"
                                                viewBox="0 0 16 16"
                                                onClick={() => {
                                                    navigate("/admin/create");
                                                }}
                                            >
                                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                            </svg>
                                        </div>
                                    </li>
                                </>
                            )}

                            {isLoggedInUser ? (
                                !isSeller ? (
                                    <>
                                        <li className="nav-item me-xl-3">
                                            <div className="px-0 nav-link d-flex justify-content-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="30"
                                                    height="30"
                                                    fill="currentColor"
                                                    className="bi bi-gift cursor"
                                                    viewBox="0 0 16 16"
                                                    data-tooltip-id="my-tooltip-multiline"
                                                    data-tooltip-html="Данный раздел находится в разработке.<br/>Здесь будет реализована сущность заказов."
                                                    /* onClick={() => {
                                                navigate("/admin/orders");
                                            }} */
                                                >
                                                    <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zM1 4v2h6V4H1zm8 0v2h6V4H9zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5V7zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5H7z" />
                                                </svg>
                                            </div>
                                        </li>

                                        <li className="nav-item mb-3 me-xl-3">
                                            <div className="nav-link d-flex justify-content-center">
                                                <div className="position-relative show-xl">
                                                    <span
                                                        className={
                                                            currentUserCart
                                                                ? "position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger"
                                                                : "d-none"
                                                        }
                                                    >
                                                        {currentUserCart}
                                                        <span className="visually-hidden">
                                                            Количество товаров в
                                                            корзине
                                                        </span>
                                                    </span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="30"
                                                        height="30"
                                                        fill="currentColor"
                                                        className="bi bi-cart-check cursor"
                                                        viewBox="0 0 16 16"
                                                        onClick={() => {
                                                            dispatch(
                                                                loadGoods()
                                                            );
                                                            navigate("/cart");
                                                        }}
                                                    >
                                                        <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
                                                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </li>
                                    </>
                                ) : (
                                    <li className="nav-item mb-3 me-xl-3">
                                        <div className="nav-link d-flex justify-content-center">
                                            <div className="position-relative show-xl">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="30"
                                                    height="30"
                                                    fill="currentColor"
                                                    className="bi bi-gear cursor"
                                                    viewBox="0 0 16 16"
                                                    onClick={() => {
                                                        dispatch(loadGoods());
                                                        navigate("/admin");
                                                    }}
                                                >
                                                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                                                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </li>
                                )
                            ) : (
                                <li className="nav-item mb-3 me-xl-3">
                                    <div className="nav-link d-flex justify-content-center">
                                        <NavLink
                                            to="/logreg"
                                            className="nav-link p-0"
                                        >
                                            Вход
                                        </NavLink>
                                    </div>
                                </li>
                            )}

                            <li
                                className="nav-item offcanvas me-3"
                                id="verticalLine"
                            >
                                <a className="nav-link px-0">|</a>
                            </li>

                            {isLoggedInUser ? (
                                <PersonalArea />
                            ) : (
                                <li className="nav-item mb-3 me-3">
                                    <div className="nav-link">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="30"
                                            height="30"
                                            fill="currentColor"
                                            className="bi bi-brightness-high cursor"
                                            viewBox="0 0 16 16"
                                            onClick={() => handleThemeChanger()}
                                        >
                                            <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                                        </svg>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <ReactTooltip id="my-tooltip-multiline" place="bottom-end" />
        </nav>
    );
};

export default NavBar;
