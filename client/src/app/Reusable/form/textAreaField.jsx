import React from "react";
import PropTypes from "prop-types";

const TextAreaField = ({ label, onChange, value, name, error, sent }) => {
    const handleChange = ({ target }) => {
        onChange({ name: target.name, value: target.value });
    };

    const getInputClasses = () =>
        // Усовершенствовал данную форму. Теперь отображение стилей адекватное.
        `form-control${
            sent && error ? " is-invalid" : sent ? " is-valid" : ""
        }`;

    // Автор забыл поставить минимальное количество строк
    return (
        <div className="mb-4">
            <label className="mb-1" htmlFor={name}>
                {label}
            </label>
            <div className="input-group has-validation">
                <textarea
                    name={name}
                    id={name}
                    value={value}
                    onChange={handleChange}
                    className={getInputClasses()}
                    rows="3"
                    style={{ width: "100%" }}
                />
            </div>
            {error && <div className="true-invalid-feedback">{error}</div>}
        </div>
    );
};

TextAreaField.defaultProps = {
    type: "text"
};

TextAreaField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    error: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    onChange: PropTypes.func,
    sent: PropTypes.bool
};

export default TextAreaField;
