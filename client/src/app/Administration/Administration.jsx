import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getCurrentUserData,
    getCurrentUserId,
    getUsersLoadingStatus
} from "../../store/users";
import {
    deleteGoods,
    filterGoods,
    getGoods,
    getGoodsLoadingStatus
} from "../../store/goods";
import Loader from "../../utils/Loader";
import { NavLink, useNavigate } from "react-router-dom";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import Pagination from "../utils/Pagination";
import { useRoot } from "../..";

const Administration = () => {
    const [toggle, setToggle] = useState({ init: false, selectAll: false }); // id флажка и его стейт

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(filterGoods()); // без pathname
    }, []);

    // Для лоадера
    const goodsLoading = useSelector(getGoodsLoadingStatus());
    const userLoading = useSelector(getUsersLoadingStatus());

    const goods = useSelector(getGoods());
    const isLoggedInUser = useSelector(getCurrentUserId());
    const isSeller = useSelector(getCurrentUserData()).isSeller;

    // Пагинация
    const [page, setPage] = useState(1); // текущая пага
    const pageSize = 12; // настраивается, количество выводимых айтемов на старницу
    const paginatedGoods = paginate(goods, page, pageSize); // нужный сплайс массива товаров
    const allPages = Math.ceil(goods?.length / pageSize); // опциональная цепочка, так как сначала стор пуст и ошибки
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

    // Объект, который буду наполнять при итерации айдишниками. Потом через них установлю id ключи для тоггла
    const toggleArr = [];
    // Из созданного массива извлекаю id и наполняю тоггл объект
    useEffect(() => {
        toggleArr.map((i) => {
            return setToggle((toggle) => ({ ...toggle, [i]: false })); // был многочасовой баг! Нельзя присваивать тогл
        });
        /* console.log(r, toggle, toggleArr); */ // +++ тогглы наполнены фолсами
    }, []);

    const navigate = useNavigate();
    const handleClick = (ev) => {
        // ДАННАЯ ФУНКЦИЯ ПОЧТИ КОПИПАСТА С CART.JSX
        // ПРИМЕЧАНИЕ: ФУНКЦИЯ ОЧЕНЬ СЛОЖНАЯ. ЕСЛИ ДЕЛАТЬ БЕЗ ДОМА, КОД БУДЕТ МАЛОЧИТАБЕЛЬНЫЙ.
        // ДА И ОТ ДОМА В РЕАКТЕ НЕ УЙТИ. ПОТОМУ ПОКА ТАК.
        // На onChange инпутов я навесил этот handleClick, так как здесь уже есть получение этих атрибутов:
        const { id } = ev.target.closest("div").dataset;
        const { name } = ev.target.closest("div").dataset;

        // УДАЛЕНИЕ ВЫБРАННЫХ ТОВАРОВ
        if (name === "delete") {
            const newGoods = goods.filter((c) => {
                // Проход по стейту - [] выбранных флажков (ключ - id товара, init или selectAll)
                const y = Object.keys(toggle).filter((key) => {
                    // Если флажок true - сохраняю
                    if (toggle[key]) return key;
                    else return false;
                });
                // y - [] нужных id + мусор init и selectAll
                // Если ключ имеет id товара, то сохраняю в newCart
                if (y.some((k) => k === c._id)) return c;
                else return false;
            });
            /* console.log("newCart", newCart); */ // [ { id: "651197cd58b290672d46f94b", pcs: 5 } ]
            // Теперь надо сделать [] id под удаление
            const idsForDelete = newGoods.map((obj) => obj._id);
            /* console.log("idsForDelete", idsForDelete); */ // [id,id...] +++
            dispatch(
                deleteGoods({
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
        // РЕДАКТИРОВАНИЕ ТОВАРА
        if (name === "edit") {
            navigate(`/admin/edit/${id}`, { state: { gid: id } });
        }
    };

    /* const handleChange = () => {}; */

    const handleSubmit = () => {};

    // Ниже удалил нативный card-body, он давал неправильную вёрстку, которая не фиксилась
    if (goodsLoading || userLoading) return <Loader />;

    if (!isSeller) navigate("/");
    else {
        goods.length && goods.map((g) => toggleArr.push(g._id));
        return paginatedGoods.length ? (
            <>
                <form onSubmit={handleSubmit} data-min-width="mq-746">
                    <div className="container-fluid mt-1 mt-sm-2 mt-md-2 mt-lg-2 mt-xl-3 mt-xxl-4">
                        <div
                            className="d-flex justify-content-between"
                            data-order="mq-1094"
                        >
                            <div className="row row-cols-1 g-1 g-sm-2 g-md-3 g-lg-4 g-xl-4 g-xxl-6 ms-1 ms-sm-2 ms-md-2 ms-lg-2 ms-xl-3 ms-xxl-4">
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
                                    // Наполняю массив id для генерации тоггла
                                    /*  toggleArr.push(g._id); */ // вынес дял всех товаров, чтобы чекбоксы были общими
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
                                                        className="card-img-top cursor"
                                                        alt={g.name}
                                                        style={{
                                                            width: "100px",
                                                            height: "100px"
                                                        }}
                                                        data-resize="mq-746"
                                                        data-hide="mq-500"
                                                        onClick={() =>
                                                            navigate(
                                                                "/" +
                                                                    path +
                                                                    "/" +
                                                                    g._id
                                                            )
                                                        }
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
                                                    <h4 className="card-title text-nowrap ms-1 ms-sm-2 ms-md-2 ms-lg-2 ms-xl-3 ms-xxl-4">
                                                        <span
                                                            style={{
                                                                display:
                                                                    "inline-block"
                                                            }}
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
                                                                {g.name}
                                                            </NavLink>
                                                        </span>
                                                    </h4>
                                                    <div
                                                        className="ms-1 ms-sm-2 ms-md-2 ms-lg-2 ms-xl-3 ms-xxl-4"
                                                        data-name="edit"
                                                        data-id={g._id}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary"
                                                            onClick={(ev) => {
                                                                handleClick(ev);
                                                            }}
                                                        >
                                                            Редактировать
                                                        </button>
                                                    </div>
                                                </div>
                                                <div
                                                    className="d-flex justify-content-between align-items-center flex-shrink-0"
                                                    style={{
                                                        width: "250px"
                                                    }}
                                                >
                                                    <h5 className="mx-3">
                                                        {g.price} ₽
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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
            navigate("/")
        );
    }
};

export default Administration;
