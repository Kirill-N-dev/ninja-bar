import React, { useState } from "react";
import PropTypes from "prop-types";

const TextField = ({ label, type, name, value, onChange, error, sent }) => {
    //
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (ev) => {
        /* console.log(ev.target); */
        onChange({ name: ev.target.name, value: ev.target.value });
    };

    const getInputClasses = () =>
        // Усовершенствовал данную форму. Теперь отображение стилей адекватное.
        // borderRightFix обязателен, это фикс для бутстрапа.
        // ps Насколько выяснил, золотая заливка у инпута появляется, если при логине выбрать сохранённые данные.
        // Похоже это стиль кеша и не баг. Тогда оставлю.
        `form-control${
            sent && error ? " is-invalid" : sent ? " is-valid" : ""
        }${type === "password" ? " borderRightFix" : ""}`;

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    // Ниже вынес ошибку для того, чтобы она всегда была снизу и не занимала места, расширяя блок при появлении
    // Убрал invalid-feedback, так как он "прыгает", где-то какие-то отступы, а пилить лень
    return (
        <div className="mb-4">
            <label className="mb-1" htmlFor={name}>
                {label}
            </label>
            <div className="input-group has-validation">
                <input
                    className={getInputClasses()}
                    style={{ borderRadius: "0 !important" }}
                    type={showPassword ? "text" : type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange} // сменил
                />
                {type === "password" && (
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={toggleShowPassword}
                    >
                        <i
                            className={
                                "bi bi-eye" + (showPassword ? "" : "-slash")
                            }
                        ></i>
                    </button>
                )}
            </div>
            {error && <div className="true-invalid-feedback">{error}</div>}
        </div>
    );
};
TextField.defaultProps = {
    type: "text"
};
TextField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // заменил со строки, иначе поле не работало
    onChange: PropTypes.func,
    error: PropTypes.string,
    sent: PropTypes.bool
};

export default TextField;
