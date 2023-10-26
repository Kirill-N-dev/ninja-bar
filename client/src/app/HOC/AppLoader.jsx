import { useEffect } from "react";

import { useDispatch } from "react-redux";

import PropTypes from "prop-types";
import iObserver from "../API/iObserver";

import { loadAuthorizedUser } from "../../store/users";
import { getUserByFirebaseId } from "../../services/localStorageService";

const AppLoader = ({ children }) => {
    const dispatch = useDispatch();
    // Логика приложения:
    // Авторизация хранится в ЛС. Оттуда попадает в стор.
    // Сначала получаю id авторизованного юзера селектором, если таковой имеется.
    // Отправляю на сервер для получения тела юзера. Диспатчу.
    // Далее навбар определяет, что отображать на месте корзины и переключателя темы.

    // Проверим, есть ли залогиненный юзер в ЛС (т.к стор на старте пуст)
    const authorizedUserId = getUserByFirebaseId();

    useEffect(() => {
        /* dispatch(loadGoods()); */ // из-за этой штуки было много багов
        // Если юзер в ЛС есть, диспатчим его тело
        authorizedUserId && dispatch(loadAuthorizedUser(authorizedUserId));
        iObserver(); // Макс, там юзается дом, я не знаю реактовской реализации данного паттерна. Сделал, что умею.
    }, []);

    /* const goodsStatus = useSelector(getGoodsLoadingStatus()); */

    // Если сущности неподгружены, рендера нет
    /* if (goodsStatus) return <Loader />; */
    return children;
};

AppLoader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default AppLoader;
