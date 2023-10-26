import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
    changeGoods,
    getGoods,
    getGoodsLoadingStatus,
    loadGoodsById
} from "../../../store/goods";

import TextField from "../../Reusable/form/textField";
import RadioField from "../../Reusable/form/radioField";

import { validator } from "../../../utils/validator";
import { validatorConfig } from "../../../utils/validatorConfig";
import TextAreaField from "../../Reusable/form/textAreaField";
import Loader from "../../../utils/Loader";

const GoodsEdit = () => {
    const location = useLocation();
    // Получаю id товара при редиректе на оную страницу из стейта локации
    // Напомню, тут логика, что только продавец может сюда попасть, причём только с админки напрямую
    // gid будет сабмититься для изменения товара, вместе с данными формы
    const gid = location.state?.gid;

    const dispatch = useDispatch();
    const currentGoods = useSelector(getGoods()); // не катит, старые данные. Надо эффектом делать сетДату
    const currentGoodsLoading = useSelector(getGoodsLoadingStatus());

    // Указание неявное, т.к товар ещё только грузится, и реакт иначе будет ругаться
    const [data, setData] = useState({
        name: "",
        desc: "",
        img_url: "",
        ingredients: "",
        weight: "",
        price: "",
        type: ""
    });

    // Для активации классов валидации полей лишь по отправке формы
    const [sent, setSent] = useState(false);
    const [errorsObj, setErrors] = useState({});

    // При первичном рендере - загрузим товар по id + логика редиректа в случае, если юзер не продавец
    useEffect(() => {
        // данная проверка работает только в эффекте. ВОПРОС - ПОЧЕМУ?
        (!gid || !location.state) && navigate("/");
        // избавление от ошибочного запроса + загрузка тела товара
        gid && dispatch(loadGoodsById(gid));
    }, []);

    // Далее, при изменении стора на полученный объект товара перепишем стейт для полей
    // Когда я тут писал код и сохранял, вскод дважды вылетал))
    useEffect(() => {
        currentGoods &&
            Object.keys(currentGoods).map((i) =>
                setData((data) => ({ ...data, [i]: currentGoods[i] }))
            );

        /* console.log(555, data); */
    }, [currentGoods]);

    /*    useEffect(() => {
        console.log(666, data);
    }, [data]); */ // кулёха, это и залью

    const navigate = useNavigate();

    !currentGoods && navigate("/logreg"); // типа протектед роута

    // На странице Administration есть проверка на продавца.
    // Поэтому если сюда зашёл не продавец, осуществляю редирект на главную.
    // Так как зайти можно только имея id и стейт локации, а последний берётся при isSeller===true
    // А можно было продублировать селектором проверки на продавца.

    // копипаста
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Почти копипаста. После многочасового дебага - решил отправлять img_url массивом. Ух и мучился.
    const handleChange = (target) => {
        if (target.name === "img_url") {
            setData((prevState) => ({
                ...prevState,
                [target.name]: target.value.split(",")
            }));
        } else {
            setData((prevState) => ({
                ...prevState,
                [target.name]: target.value // .trim() на сервере
            }));
        }
    };

    /* const uid = useSelector(getCurrentUserId()); */ // для отправки вместе с gid и новыми данными (откуда-то есть)
    // Немного отличается от других форм, отправляем патч на товар с gid параметром
    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        const isValid = validate();
        if (!isValid) return;
        /* console.log(123, data); */ // {}, то же, что в проверочном эффекте выше, но заполненное + img_url это []
        dispatch(changeGoods({ gid, data }));
        const goodsPath = currentGoods.type.slice(0, -1);
        /* console.log("goodsPath", goodsPath); */
        navigate(`/${goodsPath}/${gid}`);
    };

    // Проверка на массив товаров. Нам надо дождаться именно объекта текущего товара, дождаться обновления стора
    // Иначе, при переходе сюда со страницы товара, будет баг
    if (currentGoodsLoading || Array.isArray(currentGoods)) {
        return <Loader />;
    }

    return (
        <div className="mx-auto d-flex justify-content-center">
            <form
                className="mx-2 d-flex flex-column mt-1 mt-sm-1 mt-md-1 mt-lg2 mt-xl-3 mt-xxl-4"
                style={{ minWidth: "340px", width: "800px" }}
                onSubmit={handleSubmit}
            >
                <p className="text-center fs-5 mb-2 mb-sm-2 mb-md-2 mb-lg-3 mb-xl-4 mb-xxl-5">
                    Редактировать товар
                </p>
                {/* <fieldset disabled> */}
                <TextField
                    label="Название товара"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    error={errorsObj.name}
                    sent={sent}
                ></TextField>

                <TextAreaField
                    label="Описание"
                    name="desc"
                    value={data.desc}
                    onChange={handleChange}
                    error={errorsObj.desc}
                    sent={sent}
                ></TextAreaField>

                <TextAreaField
                    label="Ссылки на фото, через запятую"
                    name="img_url"
                    value={data.img_url}
                    onChange={handleChange}
                    error={errorsObj.img_url}
                    sent={sent}
                ></TextAreaField>

                <TextAreaField
                    label="Состав, через запятую"
                    type="ingredients"
                    name="ingredients"
                    value={data.ingredients}
                    onChange={handleChange}
                    error={errorsObj.ingredients}
                    sent={sent}
                ></TextAreaField>

                <TextField
                    label="Вес, г"
                    type="weight"
                    /*   id="weight" */
                    name="weight"
                    value={data.weight}
                    onChange={handleChange}
                    error={errorsObj.weight}
                    sent={sent}
                ></TextField>

                <TextField
                    label="Цена, ₽"
                    type="price"
                    name="price"
                    value={data.price}
                    onChange={handleChange}
                    error={errorsObj.price}
                    sent={sent}
                ></TextField>

                <RadioField
                    options={[
                        { name: "Пицца", value: "pizzas" },
                        { name: "Напиток", value: "drinks" },
                        { name: "Соус", value: "sauces" }
                    ]}
                    name="type"
                    onChange={handleChange}
                    value={data.type}
                    label="Выберите тип из существующих"
                />

                <button className="btn btn-primary w-100 mx-auto">
                    Отправить
                </button>
                {/*  </fieldset> */}
            </form>
        </div>
    );
};

export default GoodsEdit;
