import React, { useEffect, useState /* , { useEffect } */ } from "react";
import PropTypes from "prop-types";

const SelectField = ({
    label,
    value,
    onChange,
    defaultOption,
    options,
    error,
    name
}) => {
    const handleChange = ({ target }) => {
        onChange({ name: target.name, value: target.value });
    };
    const getInputClasses = () => {
        return "form-select" + (error ? " is-invalid" : "");
    };

    const optionsArray =
        !Array.isArray(options) && typeof options === "object"
            ? Object.values(options)
            : options;

    /*  useEffect(() => {
        console.log(value, 222); // value - имя профессии, "повар"
    }, [value]); */

    /* useEffect(() => {
        console.log(options, 333); // options - [{value,label,color},{},...]
    }, [options]); */

    // Автор ниже зачем-то пишет не  {option.name} а  {option.label}
    // !!! НИЖЕ ВВЁЛ КОРРЕКТИРОВКУ, ДОБАВИВ ID И ИНДЕКСЫ В МАППИНГЕ ДЛЯ КЛЮЧЕЙ ВМЕСТО option.value !!!

    // Проверка, что такое опшн (ибо он меняется от урока к уроку, а автор не объясняет)
    /* optionsArray.map((option) => console.log(option, 999)); */
    const [trueValue, setTrueValue] = useState(value);
    useEffect(() => {
        setTrueValue(value);
    }, [value]);

    return (
        <div className="mb-4">
            <label htmlFor={name} className="form-label">
                {label}
            </label>
            <select
                className={getInputClasses()}
                id={name}
                name={name}
                value={trueValue}
                /* defaultValue={value} */
                onChange={handleChange}
            >
                <option disabled value="">
                    {defaultOption}
                </option>
                {optionsArray.length > 0 &&
                    optionsArray.map((option) => (
                        /* <option
                        key={option.label}
                        value={option.value === value ? value : null}
                    >  {option.label}
                        </option> */
                        <option
                            value={option.value}
                            key={option.label}
                            /*  selected={option.value === value && true} */
                        >
                            {option.label}
                        </option>
                    ))}
            </select>
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

SelectField.propTypes = {
    defaultOption: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string,
    options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    name: PropTypes.string
};

export default SelectField;
