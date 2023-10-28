import React, { useState } from "react";
import { createGoods } from "../../../store/goods";
import { validator } from "../../../utils/validator";
import { useNavigate } from "react-router";
import { validatorConfig } from "../../../utils/validatorConfig";
import { useDispatch } from "react-redux";
import TextAreaField from "../../Reusable/form/textAreaField";
import TextField from "../../Reusable/form/textField";
import RadioField from "../../Reusable/form/radioField";

const GoodsCreate = () => {
    // Этот компонент почти идентичен GoodsEdit
    // Указание неявное, т.к данных товара пока не существует
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

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // копипаста
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Копипаста с GoodsEdit
    const handleChange = (target) => {
        /*  console.log("data", data); */
        switch (target.name) {
            case "img_url":
                setData((prevState) => ({
                    ...prevState,
                    [target.name]: target.value.split(",")
                }));
                break;
            case "weight":
                setData((prevState) => ({
                    ...prevState,
                    [target.name]: +target.value
                }));
                break;
            case "price":
                setData((prevState) => ({
                    ...prevState,
                    [target.name]: +target.value
                }));
                break;
            default:
                setData((prevState) => ({
                    ...prevState,
                    [target.name]: target.value // .trim() на сервере
                }));
                break;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        const isValid = validate();
        console.log(data);
        if (!isValid) return;
        /* console.log(123, data); */ // {}, то же, что в проверочном эффекте выше, но заполненное + img_url это []
        dispatch(createGoods({ data, navigate })); // не смог сделать тут, потому там
        // newGoods тут даст тело промиса, т.к тут нет асинхронных ф-ий
    };

    return (
        <div className="mx-auto d-flex justify-content-center">
            <form
                className="mx-2 d-flex flex-column mt-1 mt-sm-1 mt-md-1 mt-lg2 mt-xl-3 mt-xxl-4"
                style={{ minWidth: "340px", width: "800px" }}
                onSubmit={handleSubmit}
            >
                <p className="text-center fs-5 mb-2 mb-sm-2 mb-md-2 mb-lg-3 mb-xl-4 mb-xxl-5">
                    Создать новый товар
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
                    error={errorsObj.type}
                    sent={sent}
                />

                <button className="btn btn-primary w-100 mx-auto">
                    Отправить
                </button>
                {/*  </fieldset> */}
            </form>
        </div>
    );
};

export default GoodsCreate;
