import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    addToCart,
    deleteSelectedCartItems,
    getCurrentUserData,
    getCurrentUserId
} from "../../../store/users";
import { Navigate, useNavigate } from "react-router";
import {
    filterGoods,
    getGoods,
    getGoodsLoadingStatus
} from "../../../store/goods";
import Loader from "../../../utils/Loader";
import { NavLink } from "react-router-dom";
import { paginate } from "../../utils/paginate";
import _ from "lodash";
import { useRoot } from "../../..";
import Pagination from "../../utils/Pagination";

const Cart = () => {
    const [toggle, setToggle] = useState({ init: false, selectAll: false }); // id флажка и его стейт
    const [data, setData] = useState({}); // id товара и его количество
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(filterGoods()); // фильтрую без параметра - гет олл гудс
    }, []);

    const goods = useSelector(getGoods());
    const goodsLoading = useSelector(getGoodsLoadingStatus());

    const user = useSelector(getCurrentUserData());
    const navigate = useNavigate();

    const isLoggedInUser = useSelector(getCurrentUserId());
    /*     const isLoggedInUserData = useSelector(getCurrentUserData()); */

    // Объект, который буду наполнять при итерации айдишниками. Потом через них установлю id ключи для тоггла
    const toggleArr = [];

    // Из созданного массива извлекаю id и наполняю тоггл объект
    useEffect(() => {
        toggleArr.map((i) => {
            return setToggle((toggle) => ({ ...toggle, [i]: false })); // был многочасовой баг! Нельзя присваивать тогл
        });

        /* console.log(r, toggle, toggleArr); */ // +++ тогглы наполнены фолсами
    }, []);

    // Получение [] товаров, которые есть в корзине
    // Усовершенствовал, так как при старом сторе тут объект, который не итерируется
    const goodsInTheCart =
        Array.isArray(goods) &&
        goods?.filter((g) => {
            const itemOfCart = user?.cart?.filter((c) => {
                return c.id === g._id;
            });

            return itemOfCart ? g._id === itemOfCart[0]?.id : false; // только так, иначе ошибки
        });

    // Получение общей цены. Данные берутся с сервера, но не на прямую. Позже будет переезд корзины на сервер.
    let totalPrice = 0;
    Array.isArray(goods) &&
        goods?.filter((g) => {
            const itemOfCart = user?.cart?.filter((c) => {
                return c.id === g._id;
            });
            if (itemOfCart && itemOfCart[0]) {
                const pcs = itemOfCart[0].pcs;
                const price = g.price;
                console.log("!!!", pcs);
                return (totalPrice += pcs * price);
            } else return false;
        });

    // Пагинация
    const [page, setPage] = useState(1); // текущая пага
    const pageSize = 12; // настраивается, количество выводимых айтемов на старницу
    const paginatedGoods = paginate(goodsInTheCart, page, pageSize); // нужный сплайс массива товаров
    const allPages = Math.ceil(goodsInTheCart?.length / pageSize); // опциональная цепочка, так как сначала стор пуст и ошибки
    const pages = _.range(1, allPages + 1); // [1,2...]

    // Только так смог придумать подъём вверх при пагинации. Минимум дома. Но сама функция тамошняя.
    const theRoot = useRoot();
    useEffect(() => {
        theRoot.theRoot.scrollIntoView();
    }, [page]);

    // Нажатие на пагинацию
    const handlePaginate = (ev) => {
        // Имхо тут не уйти от ДОМа. Я не знаю, как. Уроков таких не было. Даже автор по реакту юзал ивент таргеты.
        const wantedParent = ev.target.closest("li").dataset.name;
        /* console.log(page); */
        switch (wantedParent) {
            case "back":
                if (page < 2) {
                    return false;
                } else {
                    setPage(page - 1);
                }
                break;

            case "forward":
                if (page >= allPages) {
                    return false;
                } else {
                    setPage(page + 1);
                }
                break;
            case "page":
                setPage(+ev.target.innerHTML);
                break;
        }
    };

    // Для инпута
    const getInitValueForInput = (id) => {
        const result = user.cart.filter((c) => c.id === id)[0].pcs;
        return result;
    };

    // Тут надо сделать стейт и функции ниже, чтобы отправлять данные в некотором виде.
    // Поскольку сервис оплаты не определён, то этот вид неизвестен, потому писать этот код
    // на данный момент не имеет смысла. Возможно позже я этому научусь или сделаю какой-нибудь мок.

    const handleClick = (ev) => {
        // ПРИМЕЧАНИЕ: ФУНКЦИЯ ОЧЕНЬ СЛОЖНАЯ. ЕСЛИ ДЕЛАТЬ БЕЗ ДОМА, КОД БУДЕТ МАЛОЧИТАБЕЛЬНЫЙ.
        // ДА И ОТ ДОМА В РЕАКТЕ НЕ УЙТИ. ПОТОМУ ПОКА ТАК.
        // На onChange инпутов я навесил этот handleClick, так как здесь уже есть получение этих атрибутов:
        const { id } = ev.target.closest("div").dataset;
        const { name } = ev.target.closest("div").dataset;

        const desc = "desc";
        const asc = "asc";

        // Клик на удалить выбранное (НАДО ПЕРЕДАТЬ ВЫБРАННЫЕ [ID,ID...] для удаления)
        if (name === "delete") {
            const newCart = user.cart.filter((c) => {
                // Проход по стейту - [] выбранных флажков (ключ - id товара, init или selectAll)
                const y = Object.keys(toggle).filter((key) => {
                    // Если флажок true - сохраняю
                    if (toggle[key]) return key;
                    else return false;
                });
                // y - [] нужных id + мусор init и selectAll
                // Если ключ имеет id товара, то сохраняю в newCart
                if (y.some((k) => k === c.id)) return c;
                else return false;
            });
            /* console.log("newCart", newCart); */ // [ { id: "651197cd58b290672d46f94b", pcs: 5 } ]
            // Теперь надо сделать [] id под удаление
            const idsForDelete = newCart.map((obj) => obj.id);
            /* console.log("idsForDelete", idsForDelete); */ // [id,id...] +++
            dispatch(
                deleteSelectedCartItems({
                    isLoggedInUser,
                    idsForDelete
                })
            );
            // Очистка общего флажка
            setToggle((prev) => ({ ...prev, selectAll: false }));
            // Возврат на первую страницу, иначе товаров не будет видно
            setPage(1);
        }

        // Клик на чекбокс товара
        if (name === "goods") {
            setToggle((toggle) => ({
                ...toggle,
                [id]: !toggle[id]
            }));
        }

        // Клик на общий чекбокс
        if (name === "selectAll") {
            // Ищу состояние и сохраняю в константу от изменений, и далее поменяю все тогглы на оное
            const xxx = !toggle[name];
            // Теперь верхний чекбокс может переключаться
            setToggle({ ...toggle, [name]: xxx });
            // Перебираю id, добавленные юсЭффектом, вызывая на каждой итерации изменение тоггла на xxx
            toggleArr.map((i) => {
                return setToggle((toggle) => ({
                    ...toggle,
                    [i]: xxx
                }));
            });
        }

        // Логика каунтеров
        if (ev.target.closest("div").dataset.name === desc) {
            handleChange(ev, desc, id);
        } else if (ev.target.closest("div").dataset.name === asc) {
            handleChange(ev, asc, id);
        }
    };
    const handleChange = (ev, counterType, id) => {
        if (!isLoggedInUser) {
            navigate("/logreg");
        } else {
            if (
                // условие для изменения инпута кликом по оному
                ev &&
                ev.target.value > 0 &&
                ev.target.value < 100
            ) {
                // Ниже обязательно перевести в число
                setData({ ...data, [ev.target.dataset.id]: +ev.target.value });
                const id = ev.target.dataset.id; // id товара
                const theItemFromCart = user.cart.filter((c) => c.id === id)[0];
                const newItemForCart = {
                    ...theItemFromCart,
                    pcs: +ev.target.value
                };
                /* console.log("666 ", counterType); */
                dispatch(
                    addToCart({
                        isLoggedInUser,
                        newItemForCart
                    })
                );
            } else {
                // условие для клика по сторонним кнопкам
                if (counterType) {
                    const mathVar = counterType === "asc" ? 1 : -1;
                    // Значение инпута по дефолту
                    const anInitValue = getInitValueForInput(id) + mathVar;
                    const theItemFromCart = user.cart.filter(
                        (c) => c.id === id
                    )[0];
                    let newItemForCart = {};
                    // если значение инпута дефолтное (стейт пуст), беру оное
                    if (!data[id]) {
                        // Стейт меняю только на числа из нужного диапазона
                        if (anInitValue > 0 && anInitValue < 100) {
                            setData({ ...data, [id]: anInitValue });
                            newItemForCart = {
                                ...theItemFromCart,
                                pcs: anInitValue
                            };
                        } else return false;
                        /* console.log("!dataId, ", data[id]); */ // сначала выдаёт андефайнед - ПОЧЕМУ? ВОПРОС!
                    } else {
                        // иначе беру текущее значение стейта !!! ЛОГИКА ПОД ВОПРОСОМ, ПРИШЛОСЬ КРУТИТЬ ЕДИНИЦЫ
                        if (data[id]) {
                            // Стейт меняю только на числа из нужного диапазона
                            if (
                                data[id] + mathVar > 0 &&
                                data[id] + mathVar < 100
                            ) {
                                setData({ ...data, [id]: data[id] + mathVar });
                                newItemForCart = {
                                    ...theItemFromCart,
                                    pcs: data[id] + mathVar
                                };
                            } else return false;
                        }
                    }
                    dispatch(
                        addToCart({
                            isLoggedInUser,
                            newItemForCart
                        })
                    );
                }
            }
        }
    };

    const handleSubmit = () => {};

    // Ниже удалил нативный card-body, он давал неправильную вёрстку, которая не фиксилась
    // Ниже проверка на массивность товаров. Так как если перейти в корзину со страницы товаров, то стор будет {}
    if (goodsLoading || !user || !Array.isArray(goods)) return <Loader />;
    else {
        goods.map((g) => toggleArr.push(g._id));
        return goodsInTheCart.length ? (
            <>
                <form onSubmit={handleSubmit} data-min-width="mq-746">
                    <div className="container-fluid mt-1 mt-sm-2 mt-md-2 mt-lg-2 mt-xl-3 mt-xxl-4">
                        <div
                            className="d-flex justify-content-between"
                            data-order="mq-1094"
                        >
                            <div className="row row-cols-1 g-1 g-sm-2 g-md-3 g-lg-4 g-xl-5 g-xxl-6 ms-1 ms-sm-2 ms-md-2 ms-lg-2 ms-xl-3 ms-xxl-4">
                                <div className="col">
                                    <div
                                        className="flex-shrink-0 align-self-center form-check position-relative"
                                        style={{
                                            width: "100px",
                                            height: "20px"
                                        }}
                                        data-shrink="mq-400"
                                        data-name="selectAll"
                                    >
                                        <input
                                            className="position-absolute cursor"
                                            type="checkbox"
                                            value=""
                                            checked={toggle.selectAll}
                                            onChange={handleClick}
                                            id="selectAll"
                                            /* onChange={handleChange} */
                                            /*  checked={value} */
                                            style={{
                                                top: "42%",
                                                left: "42%",
                                                width: "20px",
                                                height: "20px"
                                            }}
                                        />
                                        <div
                                            className="position-absolute d-flex"
                                            style={{
                                                top: "34%",
                                                left: "100%"
                                            }}
                                        >
                                            <div
                                                className=""
                                                style={{
                                                    marginRight: "26px"
                                                }}
                                                data-move="mq-400"
                                            >
                                                <label
                                                    className="text-nowrap cursor"
                                                    htmlFor="selectAll"
                                                >
                                                    Выбрать все
                                                </label>
                                            </div>
                                            <div
                                                className="text-nowrap"
                                                style={{
                                                    marginLeft: "5px"
                                                }}
                                                data-name="delete"
                                            >
                                                <label
                                                    className="text-nowrap cursor"
                                                    onClick={(ev) =>
                                                        handleClick(ev)
                                                    }
                                                >
                                                    Удалить выбранное
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {paginatedGoods.map((g) => {
                                    const initValue = getInitValueForInput(
                                        g._id
                                    );

                                    // Наполняю массив id для генерации тоггла
                                    // для выбора всех товаров независимо от корзины надо итерироваться по goodsInTheCart
                                    /* toggleArr.push(g._id); */
                                    const path = g.type.slice(0, -1);
                                    return (
                                        <div className="col" key={g._id}>
                                            <div
                                                className="card border-0 h-100 d-flex flex-row"
                                                data-wrap="mq-746"
                                            >
                                                <div
                                                    className="flex-shrink-0 align-self-center form-check position-relative"
                                                    style={{
                                                        width: "100px",
                                                        height: "100px"
                                                    }}
                                                    data-id={g._id}
                                                    data-name="goods"
                                                    data-shrink="mq-400"
                                                >
                                                    <input
                                                        className="position-absolute cursor"
                                                        type="checkbox"
                                                        value=""
                                                        /* onClick={handleClick} */
                                                        checked={
                                                            toggle[g._id]
                                                                ? toggle[g._id]
                                                                : toggle.init
                                                        }
                                                        onChange={handleClick}
                                                        /*  checked={value} */
                                                        style={{
                                                            top: "42%",
                                                            left: "42%",
                                                            width: "20px",
                                                            height: "20px"
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    className="align-self-center d-flex flex-column justify-content-center"
                                                    style={{
                                                        width: "100px",
                                                        height: "100px"
                                                    }}
                                                    /* data-hide="mq-746" */
                                                    data-resize="mq-746"
                                                    data-hide="mq-500"
                                                >
                                                    <img
                                                        src={g.img_url[0]}
                                                        className="card-img-top"
                                                        alt={g.name}
                                                        style={{
                                                            width: "100px",
                                                            height: "100px"
                                                        }}
                                                        data-resize="mq-746"
                                                    />
                                                </div>

                                                <div
                                                    className="d-flex flex-column justify-content-start flex-grow-1 me-5"
                                                    style={{
                                                        height: "100px",
                                                        width: "260px"
                                                    }}
                                                    data-reposition="mq-746"
                                                    data-margin-end-0="mq-500"
                                                >
                                                    <NavLink
                                                        to={
                                                            "/" +
                                                            path +
                                                            "/" +
                                                            g._id
                                                        }
                                                        style={{
                                                            textDecoration:
                                                                "none"
                                                        }}
                                                        className="nav-link"
                                                    >
                                                        <h4 className="card-title text-nowrap ms-1 ms-sm-2 ms-md-2 ms-lg-2 ms-xl-3 ms-xxl-4">
                                                            {g.name}
                                                        </h4>
                                                        <p
                                                            className="overflow-hidden card-text ms-1 ms-sm-2 ms-md-2 ms-lg-2 ms-xl-3 ms-xxl-4"
                                                            style={{
                                                                height: "50px"
                                                            }}
                                                            data-hide="mq-746"
                                                        >
                                                            Состав:{" "}
                                                            {g.ingredients}
                                                        </p>
                                                    </NavLink>
                                                </div>
                                                <div
                                                    className="d-flex justify-content-between align-items-center flex-shrink-0"
                                                    style={{
                                                        width: "250px"
                                                    }}
                                                >
                                                    <h5 className="mx-3">
                                                        {data[g._id]
                                                            ? g.price *
                                                              data[g._id]
                                                            : g.price *
                                                              getInitValueForInput(
                                                                  g._id
                                                              )}{" "}
                                                        ₽
                                                    </h5>
                                                    <div className="me-2 mb-2">
                                                        <div className="input-group d-flex align-items-center flex-nowrap">
                                                            <div
                                                                className="border rounded-start cursor"
                                                                onClick={(ev) =>
                                                                    handleClick(
                                                                        ev
                                                                    )
                                                                }
                                                                data-id={g._id}
                                                                data-name="desc"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="40"
                                                                    height="40"
                                                                    fill="currentColor"
                                                                    className="bi bi-dash-lg"
                                                                    viewBox="-12 -12 40 40"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <input
                                                                className="form-control text-center"
                                                                type="text"
                                                                maxLength="2"
                                                                value={
                                                                    data[
                                                                        g._id
                                                                    ] ||
                                                                    initValue
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                data-id={g._id}
                                                                style={{
                                                                    width: "45px",
                                                                    height: "42px"
                                                                }}
                                                            />
                                                            <div
                                                                className="border rounded-end cursor"
                                                                onClick={(ev) =>
                                                                    handleClick(
                                                                        ev
                                                                    )
                                                                }
                                                                data-id={g._id}
                                                                data-name="asc"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="40"
                                                                    height="40"
                                                                    fill="currentColor"
                                                                    className="bi bi-plus-lg"
                                                                    viewBox="-12 -12 40 40"
                                                                    preserveAspectRatio="xMidYMid meet"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div
                                className="d-flex flex-column flex-shrink-0"
                                style={{
                                    width: "340px"
                                    /* backgroundColor: "blue" */
                                }}
                                data-position="mq-1094"
                            >
                                <div
                                    className="d-flex flex-row align-self-center justify-content-between align-items-center"
                                    style={{
                                        width: "300px"
                                    }}
                                >
                                    <span>Итого</span>
                                    <h5 className="text text-success">
                                        {totalPrice} ₽
                                    </h5>
                                </div>
                                <button
                                    className="btn btn-success align-self-center mt-2 mb-3"
                                    style={{
                                        width: "300px"
                                    }}
                                    type="button"
                                    onClick={() => navigate("/user/orders")}
                                >
                                    Оформить заказ
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                <Pagination
                    pages={pages}
                    page={page}
                    handlePaginate={handlePaginate}
                />
            </>
        ) : (
            <Navigate to="/" />
        );
    }
};

export default Cart;
