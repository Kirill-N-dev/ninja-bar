import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getGoods,
    getGoodsLoadingStatus,
    loadGoods,
    loadGoodsById
} from "../../store/goods";
import { useNavigate, useParams } from "react-router";
import Loader from "../../utils/Loader";
import {
    addToCart,
    getCurrentUserData,
    getCurrentUserId
} from "../../store/users";

const GoodsPage = () => {
    //
    const [active, setActive] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedInUser = useSelector(getCurrentUserId());

    useEffect(() => {
        dispatch(loadGoodsById(id));
    }, []);

    const goods = useSelector(getGoods());
    const goodsStatus = useSelector(getGoodsLoadingStatus());

    const isLoggedInUserData = useSelector(getCurrentUserData());

    const cartChecker = (id) => {
        // с проверкой, иначе баг
        const rrr = isLoggedInUserData?.cart?.filter((g) => g.id === id).length;
        return rrr;
    };

    const handleClick = (ev) => {
        if (!isLoggedInUser) {
            navigate("/logreg");
        } else {
            const { id } = ev.target.dataset; // id товара
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

    const handleToggle = ({ target }) => {
        const { order } = target.dataset;
        const bsSlide = target.closest("button")?.dataset.bsSlide; // интересно, что с деструктуризацией тут баг

        if (order) {
            setActive(+order);
        } else {
            if (bsSlide === "next") {
                if (goods.img_url.length !== active + 1) {
                    setActive(active + 1);
                } else {
                    setActive(0);
                }
            } else {
                if (bsSlide === "prev") {
                    if (active !== 0) {
                        setActive(active - 1);
                    } else {
                        const lastIndex = goods.img_url.length - 1;
                        setActive(lastIndex);
                    }
                }
            }
        }
    };

    /* console.log("goods", goods); */

    // Ниже проверка на то, что в сторе. Если переход со страниц товаров, то в сторе массив. А нам надо ждать {}
    if (Array.isArray(goods) || goodsStatus) return <Loader />;
    return (
        <div className="container-fluid mt-1 mt-sm-2 mt-md-3 mt-lg-4 mt-xl-5 mt-xxl-6">
            <div className="card border-0" /* style={{ maxWidth: "540px" }} */>
                <div className="row g-0 justify-content-center">
                    <div
                        className="col flex-grow-0 mx-1 mx-sm-2 mx-md-3 mx-lmx-4 mx-xl-5 mx-xxl-6"
                        data-hide="mq-900"
                    >
                        {goods.img_url.map((i, ind) => (
                            <div className="mb-1" key={ind}>
                                <img
                                    src={i}
                                    className={
                                        active === ind
                                            ? "mt-4 border border-2 rounded-2"
                                            : "mt-4"
                                    }
                                    alt="..."
                                    style={{ width: "100px" }}
                                    data-order={ind}
                                    onClick={(target) => handleToggle(target)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="col flex-grow-0">
                        <div
                            id="carouselExampleIndicators"
                            className="carousel slide carousel-fade"
                            data-bs-theme="dark"
                        >
                            <div className="carousel-indicators">
                                {goods.img_url.map((i, ind) => (
                                    <button
                                        key={ind}
                                        type="button"
                                        data-bs-target="#carouselExampleIndicators"
                                        data-bs-slide-to={ind}
                                        aria-label={
                                            "Slide" + " " + (1 + active)
                                        }
                                        className={
                                            ind === active ? "active" : ""
                                        }
                                        aria-current={ind === active && "true"}
                                        data-order={ind}
                                        onClick={(target) =>
                                            handleToggle(target)
                                        }
                                    ></button>
                                ))}
                            </div>
                            <div
                                className="carousel-inner flex-nowrap"
                                style={{ width: "400px" }}
                                data-resize="mq-412"
                            >
                                {goods.img_url.map((g, ind) => (
                                    <div
                                        className={
                                            ind === active
                                                ? "carousel-item active "
                                                : "carousel-item"
                                        }
                                        key={ind}
                                    >
                                        <img
                                            src={g}
                                            alt="..."
                                            className="img-fluid"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide="prev"
                                onClick={(target) => handleToggle(target)}
                            >
                                <span
                                    className="carousel-control-prev-icon"
                                    aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">
                                    Предыдущий
                                </span>
                            </button>
                            <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide="next"
                                onClick={(target) => handleToggle(target)}
                            >
                                <span
                                    className="carousel-control-next-icon"
                                    aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">
                                    Следующий
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="col mx-1 mx-sm-2 mx-md-3 mx-lmx-4 mx-xl-5 mx-xxl-6">
                        <div className="card-body h-100 d-flex flex-column">
                            <h2 className="card-title mb-4">{goods.name}</h2>
                            <p className="card-text fs-5">{goods.desc}</p>
                            <p className="card-text">
                                Состав: {goods.ingredients}
                            </p>
                            <p className="card-text flex-grow-1">
                                Вес: {goods.weight} г
                            </p>

                            <div className="d-flex justify-content-between align-content-center">
                                <h5 className="me-3 text-nowrap">
                                    {goods.price} ₽
                                </h5>
                                <div className="me-2 mb-2">
                                    {cartChecker(id) ? (
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={() => {
                                                dispatch(loadGoods());
                                                navigate("/cart");
                                            }}
                                        >
                                            Оформить
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={(ev) => {
                                                handleClick(ev);
                                            }}
                                            data-id={id}
                                        >
                                            В корзину
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoodsPage;
