import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getCurrentUserData,
    getCurrentUserId,
    getUsersLoadingStatus,
    updateUser
} from "../../../store/users";
import TextField from "../../Reusable/form/textField";
import RadioField from "../../Reusable/form/radioField";
import { useLocation, useNavigate } from "react-router";
import { validator } from "../../../utils/validator";
import { validatorConfig } from "../../../utils/validatorConfig";
import Loader from "../../../utils/Loader";

const PersonalData = () => {
    //
    const navigate = useNavigate();
    const isLoggedInUser = useSelector(getCurrentUserId()); // для отправки вместе с новыми данными
    const currentUser = useSelector(getCurrentUserData());
    const dataLoading = useSelector(getUsersLoadingStatus());
    !currentUser && navigate("/logreg"); // типа протектед роута
    const dispatch = useDispatch();
    const location = useLocation();

    // Установка значений полей для юзера
    // Указание неявное, так как хоть юзер ест ьв аплоадере, но при обновлении страницы он придёт асинхронно, и нужен тру
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
        license: ""
    });

    // Так как в случае обновления страницы юзер придёт асинхронно, будем отлавливать его появление зависимостью:
    // (можно было написать итерацией, но пусть будет и так, для примера. Итерация в GoodsEdit)
    useEffect(() => {
        !dataLoading &&
            setData({
                name: currentUser.name,
                surname: currentUser.surname,
                patronymic: currentUser.patronymic,
                phone: currentUser.phone,
                password: "",
                sex: currentUser.sex,
                region: currentUser.region,
                city: currentUser.city,
                street: currentUser.street,
                apartment: currentUser.apartment,
                license: currentUser.license
            });
    }, [dataLoading]);

    // Для активации классов валидации полей лишь по отправке формы
    const [sent, setSent] = useState(false);

    const [errorsObj, setErrors] = useState({});

    // копипаста
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // копипаста
    // Интересно, что в стейте телефона изначально число (пришло с сервера). И валидатор с ним конфликтовал - вылечил.
    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value /* .trim() */ // небольшой костыль. Просто запретил пробелы, т.к иначе не смог
        }));
    };

    // Функция для сабмита данных - перебирает весь стейт, применяя .trim() - странно, что автор этого не сделал
    // !!! НЕ РАБОТАЕТ !!! СОСТОЯНИЕ НЕ УСПЕВАЕТ ОБНОВИТЬСЯ ДО ОТПРАВКИ. РЕШЕНИЕ ПОКА НЕ НАЙДЕНО
    // ПРИДУМАЛ ДЕЛАТЬ ТРИМ НА СЕРВЕРЕ.
    /* const trimer = async () => {
        await Object.keys(data).map(
            (i) =>
                i !== "phone" &&
                setData({ ...data, i: data[i].toString().trim() })
        );
    }; */
    // Немного отличается от регистрации, отправляем патч на юзера
    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        const isValid = validate();
        if (!isValid) return;
        /* console.log(123, data); */
        dispatch(updateUser({ isLoggedInUser, data }, location, navigate));
    };

    if (dataLoading) return <Loader />;
    return (
        <div className="mx-auto d-flex justify-content-center">
            <form
                className="mx-2 d-flex flex-column mt-1 mt-sm-1 mt-md-1 mt-lg2 mt-xl-3 mt-xxl-3"
                style={{ minWidth: "340px", width: "800px" }}
                onSubmit={handleSubmit}
            >
                <p className="text-center fs-5 mb-2 mb-sm-2 mb-md-2 mb-lg3 mb-xl-4 mb-xxl-4">
                    Изменить персональные данные
                </p>
                {/* <fieldset disabled> */}
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

                <button className="btn btn-primary w-100 mx-auto">
                    Отправить
                </button>
                {/*  </fieldset> */}
            </form>
        </div>
    );
};

export default PersonalData;
