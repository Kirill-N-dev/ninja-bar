import React from "react";
import PropTypes from "prop-types";

const RadioField = ({ options, name, onChange, value, label, error, sent }) => {
    //
    const handleChange = (ev) => {
        onChange({ name: ev.target.name, value: ev.target.value });
    };

    const getInputClasses = () =>
        // Усовершенствовал данную форму. Теперь отображение стилей адекватное.
        // borderRightFix обязателен, это фикс для бутстрапа.
        // ps Насколько выяснил, золотая заливка у инпута появляется, если при логине выбрать сохранённые данные.
        // Похоже это стиль кеша и не баг. Тогда оставлю.
        `form-check-input cursor${
            sent && error ? " is-invalid" : sent ? " is-valid" : ""
        }`;

    return (
        <div className="mb-4">
            <div>
                <label className="form-label">{label}</label>
            </div>

            {options.map((opt) => {
                return (
                    <div
                        className="form-check form-check-inline"
                        key={opt.name}
                    >
                        <input
                            className={getInputClasses()}
                            type="radio"
                            name={name}
                            id={opt.name + "_" + opt.value}
                            value={opt.value}
                            checked={opt.value === value}
                            onChange={handleChange}
                        />
                        <label
                            className="form-check-label cursor"
                            htmlFor={opt.name + "_" + opt.value}
                        >
                            {opt.name}
                        </label>
                    </div>
                );
            })}
        </div>
    );
};

RadioField.propTypes = {
    options: PropTypes.array,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    label: PropTypes.string,
    error: PropTypes.string,
    sent: PropTypes.bool
};

export default RadioField;
