import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserData, logOut } from "../../store/users";
import { useLocation, useNavigate } from "react-router";
import { themeChanger } from "../../utils/themeChanger";
import { NavLink } from "react-router-dom";

const PersonalArea = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Без проверки ошибка
    const currentUserName = useSelector(getCurrentUserData())?.name;
    const isSeller = useSelector(getCurrentUserData()).isSeller;

    const handleLogOut = () => {
        dispatch(logOut());
        let redirect;
        if (location.state) {
            redirect = location.state.from;
        } else {
            redirect = "/";
        }
        navigate(redirect);
    };
    // Ниже убрал offcanvas-xl, так как доступ должен быть
    return (
        <li className="nav-item dropdown d-flex flex-column align-items-center">
            <a
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {currentUserName}
            </a>
            <ul className="dropdown-menu mt-n2">
                {isSeller ? (
                    <>
                        <li>
                            <NavLink
                                to="/admin/orders"
                                className="dropdown-item"
                            >
                                Заказы
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/create"
                                className="dropdown-item"
                            >
                                Создать товар
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin" className="dropdown-item" end>
                                Панель управления
                            </NavLink>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink
                                to="/user/orders"
                                className="dropdown-item"
                            >
                                Мои заказы
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/cart" className="dropdown-item">
                                Перейти в корзину
                            </NavLink>
                        </li>
                    </>
                )}

                <li>
                    <NavLink to="/personal" className="dropdown-item">
                        Личные данные
                    </NavLink>
                </li>
                <li>
                    <a
                        className="dropdown-item"
                        data-purpose="themeChanger"
                        onClick={(ev) => themeChanger(ev)}
                    >
                        Сменить тему
                    </a>
                </li>
                <li>
                    <a className="dropdown-item" onClick={handleLogOut}>
                        Выйти
                    </a>
                </li>
            </ul>
        </li>
    );
};

export default PersonalArea;
