import React, { useState } from "react";
import TextField from "../../Reusable/form/textField";
import { validator } from "../../../utils/validator";
import RadioField from "../../Reusable/form/radioField";
import CheckBoxField from "../../Reusable/form/checkBoxField";
import { useDispatch } from "react-redux";
import { signUp } from "../../../store/users";
import { useLocation, useNavigate } from "react-router";
import { validatorConfig } from "../../../utils/validatorConfig";

const RegisterForm = () => {
    // почти копипаста
    // Указание неявное, т.к нет готового источника данных и нужен первичный тру для data
    const [data, setData] = useState({
        name: "",
        surname: "",
        patronymic: "",
        phone: "",
        password: "",
        sex: "",
        region: "",
        city: "",
        street: "",
        apartment: "",
        license: false,
        isSeller: false
    });

    // Для активации классов валидации полей лишь по отправке формы
    const [sent, setSent] = useState(false);
    const [errorsObj, setErrors] = useState({});

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const handleChange = (target) => {
        // [target.name]: target.value - по атрибуту name (выбранный компонент) будет создаваться поле
        setData((prevState) => ({ ...prevState, [target.name]: target.value }));
    };

    // копипаста
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        const isValid = validate();
        if (!isValid) return;
        /* console.log(123, data); */ // накопленный дата стейт отправляется в диспатч, там дату надо обработать
        dispatch(signUp({ ...data }, location, navigate)); // по сути конец документа ПОПРАВИЛ ПЕРЕДАЧУ

        // !!! ТАК БЫЛО У АВТОРОВ. НО ПО ИДЕЕ, ЕСЛИ СЕРВЕР ДАСТ ОШИБКУ, ТО БУДЕТ РЕДИРЕКТ, ЧЕГО НЕ ДОЛЖНО БЫТЬ
        // В ЛОГИНЕ Я ПЕРЕДЕЛАЛ, ПЕРЕНЕСЯ СИЮ ЛОГИКУ В САМ МЕТОД, ПОСЛЕ AWAIT
        /* let redirect;
        if (location.state) {
            redirect = location.state.from;
        } else {
            redirect = "/";
        }
        navigate(redirect); */
    };

    // Ниже ок, изменил под проект
    return (
        <form
            className="mx-auto d-flex flex-column mt-1 mt-sm-2 mt-md-2 mt-lg-3 mt-xl-4 mt-xxl-5"
            style={{ width: "400px" }}
            onSubmit={handleSubmit}
        >
            <h2 className="card-title text-center mb-4">
                Для совершения покупок необходимо зарегистрироваться
            </h2>
            <TextField
                label="Имя"
                name="name"
                value={data.name}
                onChange={handleChange}
                error={errorsObj.name}
                sent={sent}
            ></TextField>

            <TextField
                label="Фамилия"
                name="surname"
                value={data.surname}
                onChange={handleChange}
                error={errorsObj.surname}
                sent={sent}
            ></TextField>

            <TextField
                label="Отчество"
                name="patronymic"
                value={data.patronymic}
                onChange={handleChange}
                error={errorsObj.patronymic}
                sent={sent}
            ></TextField>

            <TextField
                label="Телефон"
                type="phone"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                error={errorsObj.phone}
                sent={sent}
            ></TextField>

            <TextField
                label="Пароль"
                type="password"
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                error={errorsObj.password}
                sent={sent}
            ></TextField>

            <RadioField
                options={[
                    { name: "Мужской", value: "Мужской" },
                    { name: "Женский", value: "Женский" }
                ]}
                name="sex"
                onChange={handleChange}
                value={data.sex}
                label="Укажите ваш пол"
            />

            <TextField
                label="Область"
                type="region"
                name="region"
                value={data.region}
                onChange={handleChange}
                error={errorsObj.region}
                sent={sent}
            ></TextField>

            <TextField
                label="Город"
                type="city"
                name="city"
                value={data.city}
                onChange={handleChange}
                error={errorsObj.city}
                sent={sent}
            ></TextField>

            <TextField
                label="Улица"
                type="street"
                name="street"
                value={data.street}
                onChange={handleChange}
                error={errorsObj.street}
                sent={sent}
            ></TextField>

            <TextField
                label="Квартира"
                type="apartment"
                name="apartment"
                value={data.apartment}
                onChange={handleChange}
                error={errorsObj.apartment}
                sent={sent}
            ></TextField>

            <CheckBoxField
                name="license"
                value={data.license}
                onChange={handleChange}
                error={errorsObj.license}
                sent={sent}
            >
                Подтвердить лицензионное соглашение
            </CheckBoxField>
            <CheckBoxField
                name="isSeller"
                value={data.isSeller}
                onChange={handleChange}
            >
                Выберите для регистрации в качестве продавца
            </CheckBoxField>
            <button className="btn btn-primary w-100 mx-auto">Отправить</button>
        </form>
    );
};

export default RegisterForm;
