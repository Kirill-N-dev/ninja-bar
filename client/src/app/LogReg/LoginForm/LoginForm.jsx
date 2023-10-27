import React, { useState } from "react";
import TextField from "../../Reusable/form/textField";
import { validator } from "../../../utils/validator";
import CheckBoxField from "../../Reusable/form/checkBoxField";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getAuthErrors, logIn } from "../../../store/users";
import { NavLink } from "react-router-dom";
/* import { getAuthErrors, logIn } from "../../store/users"; */ // !!! need

const LogReg = () => {
    // Указание неявное, т.к нет готового источника данных
    const [data, setData] = useState({
        phone: "",
        password: "",
        stayOn: false
    });
    // Для активации классов валидации полей лишь по отправке формы
    const [sent, setSent] = useState(false);
    //
    const [errorsObj, setErrors] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    //

    const dispatch = useDispatch();
    const loginError = useSelector(getAuthErrors()); // надо ниже!

    // Контроль полей
    const handleChange = (target) => {
        setData((prevState) => ({ ...prevState, [target.name]: target.value }));
    };

    const validatorConfig = {
        phone: {
            isRequired: {
                message: "Телефон обязателен для заполнения"
            },
            isNumber: {
                message: "Только цифры"
            },
            min: {
                message: `Телефон должен содержать от 5 символов`,
                value: 5
            }
        },
        password: {
            isRequired: {
                message: "Пароль обязателен для заполнения"
            },
            isCapitalSymbol: {
                message: "Пароль должен содержать хотя бы одну заглавную букву"
            },
            isContainDigit: {
                message: "Пароль должен содержать хотя бы одну цифру"
            },
            min: {
                message: `Пароль должен содержать от 8 символов`,
                value: 8
            }
        }
    };

    const validate = () => {
        // тут проверка только на длину и наличие заглавных и цифр в пароле
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        const isValid = validate();
        if (!isValid) return false; // если есть ошибки, отправки формы не будет

        // Если правильно понял, стейт должен передаваться с родителей (а где - не понял, ибо копипаста)
        // Ниже просто решается, куда метод logIn будет редиректить
        // НО НЕ ПОНЯЛ, ОТКУДА СТЕЙТ У ЛОКЕЙШН

        dispatch(logIn(data, location, navigate));

        // убрал { payload: data } - из-за этой хероты несколько часов дебага. Нахер эти выкрутасы? Только путаница.
        // Моя логика для редиректа: только если авторизация успешна. Иначе в сторе есть ошибка. Достаю геттер:
        // Не удалось, стейт асинхронен. Потом перенёс логику в сам метод logIn, после await.
    };

    return (
        <>
            <form
                className="mx-auto d-flex flex-column mt-1 mt-sm-2 mt-md-2 mt-lg-3 mt-xl-4 mt-xxl-5"
                style={{ width: "400px" }}
                onSubmit={handleSubmit}
            >
                <h2 className="card-title text-center mb-4">Вход в систему</h2>
                <TextField
                    label="Телефон"
                    id="phone"
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
                <CheckBoxField
                    name="stayOn"
                    value={data.stayOn}
                    onChange={handleChange}
                >
                    Оставаться в системе
                </CheckBoxField>
                {loginError && <p className="text-danger">{loginError}</p>}
                <button className="btn btn-primary w-100 mb-3">Войти</button>
                <NavLink to="reg">Регистрация</NavLink>
            </form>
        </>
    );
};

LogReg.propTypes = {};

export default LogReg;
