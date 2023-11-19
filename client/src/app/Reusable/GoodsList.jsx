import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
    addToCart,
    getCurrentUserData,
    getCurrentUserId
} from "../../store/users";
import { useNavigate } from "react-router";
import { paginate } from "../utils/paginate";
import Pagination from "../utils/Pagination";
import _ from "lodash";
import Sorting from "../utils/Sorting";
import {
    filterGoods,
    getGoods,
    getGoodsLoadingStatus,
    loadGoods
} from "../../store/goods";
import { NavLink } from "react-router-dom";
import Loader from "../../utils/Loader";
import { useRoot } from "../..";

const GoodsList = ({ pathname }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(filterGoods(pathname));
    }, []);

    const goods = useSelector(getGoods());
    const goodsStatus = useSelector(getGoodsLoadingStatus());

    // Пагинация (составные данного блока копипастятся, например в Administration и Cart)
    const [page, setPage] = useState(1); // текущая пага
    const pageSize = 12; // настраивается, количество выводимых айтемов на старницу
    const paginatedGoods = paginate(goods, page, pageSize); // нужный сплайс массива товаров
    const allPages = Math.ceil(goods?.length / pageSize); // опциональная цепочка, так как сначала стор пуст и ошибки
    const pages = _.range(1, allPages + 1); // [1,2...]

    // Подъём вверх при пагинации
    const theRoot = useRoot();
    useEffect(() => {
        theRoot.theRoot.scrollIntoView();
    }, [page]);

    const navigate = useNavigate();
    const isLoggedInUser = useSelector(getCurrentUserId());
    const isLoggedInUserData = useSelector(getCurrentUserData());

    const handleClick = (ev) => {
        ev.preventDefault();

        // Нажатие на сортировку
        const { name } = ev.target.closest("div").dataset;
        if (name === "expensive" || name === "cheaper") {
            dispatch(filterGoods(pathname, name));
            // Возврат на первую страницу, иначе товаров не будет видно
            setPage(1);
        } else if (!isLoggedInUser) {
            // Нажатие на кнопку "в корзину"
            navigate("/logreg");
        } else {
            const { id } = ev.target.dataset;
            const newItemForCart = { id, pcs: 1 }; // начальное количество товаров - 1, изменяется в корзине
            // данная константа должна иметь это же имя, так как сервис принимает её одну, а функция
            // вызывается и с Cart и с GoodsCard - передавая через сие имя разные данные

            dispatch(
                addToCart({
                    isLoggedInUser,
                    newItemForCart
                })
            );
        }
    };

    // Нажатие на пагинацию
    const handlePaginate = (ev) => {
        const wantedParent = ev.target.closest("li").dataset.name;
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

    const cartChecker = (id) => {
        const rrr = isLoggedInUserData?.cart?.filter((g) => g.id === id).length;
        return rrr;
    };

    // При переходе со страницы товара в сторе может быть объект товара. Он неитерируемый.
    // Поэтому ниже проверка на загруженные товары и на то, массив ли они, т.к ф-ия paginate усовершенствована
    if (goodsStatus || !paginatedGoods) {
        return <Loader />;
    }
    return (
        <>
            <Sorting onClick={handleClick}></Sorting>
            <div className="container-xl mt-1 mt-sm-2 mt-md-3 mt-lg-4 mt-xl-5 mt-xxl-6">
                <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-4 g-1 g-sm-2 g-md-3 g-lg-4 g-xl-5 g-xxl-6">
                    {paginatedGoods.map((g) => {
                        const path = g.type.slice(0, -1);
                        return (
                            <div className="col" key={g._id}>
                                <NavLink
                                    to={"/" + path + "/" + g._id}
                                    style={{ textDecoration: "none" }}
                                >
                                    <div
                                        className="card border-0 h-100 mx-auto d-flex flex-column"
                                        style={{ maxWidth: "360px" }}
                                    >
                                        <div
                                            className="align-self-center d-flex justify-content-center align-items-center"
                                            style={{
                                                width: "300px",
                                                height: "300px"
                                            }}
                                        >
                                            <img
                                                src={g.img_url[0]}
                                                className="card-img-top resize"
                                                alt={g.name}
                                            />
                                        </div>

                                        <div className="card-body">
                                            <h4 className="card-title text-center mb-4">
                                                {g.name}
                                            </h4>
                                            <p className="card-text flex-grow-1">
                                                {g.desc}
                                            </p>
                                        </div>
                                        <div className="d-flex justify-content-between align-content-center">
                                            <h5 className="mx-3">
                                                {g.price} ₽
                                            </h5>
                                            <div className="me-2 mb-2">
                                                {cartChecker(g._id) ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        onClick={(ev) => {
                                                            ev.preventDefault();
                                                            dispatch(
                                                                loadGoods()
                                                            );
                                                            navigate("/cart");
                                                        }}
                                                    >
                                                        Оформить
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary"
                                                        onClick={(ev) => {
                                                            handleClick(ev);
                                                        }}
                                                        data-id={g._id}
                                                    >
                                                        В корзину
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </NavLink>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Pagination
                pages={pages}
                page={page}
                handlePaginate={handlePaginate}
            />
        </>
    );
};

GoodsList.propTypes = {
    goods: PropTypes.array,
    good: PropTypes.array,
    pathname: PropTypes.string,
    setSortBy: PropTypes.func
};

export default GoodsList;
