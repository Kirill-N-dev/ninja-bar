import { React } from "react";
import PropTypes from "prop-types";

function CheckBoxField({ name, value, onChange, children, error, sent }) {
    //
    const handleChange = () => {
        onChange({ name: name, value: !value });
    };

    const getInputClasses = () =>
        // Усовершенствовал данную форму. Теперь отображение стилей адекватное.
        `form-check-input cursor${
            sent && error ? " is-invalid" : sent ? " is-valid" : ""
        }`;

    return (
        <div className="form-check mb-3">
            <input
                className={getInputClasses()}
                type="checkbox"
                value=""
                id={name}
                onChange={handleChange}
                checked={value}
            />
            <label className="form-check-label cursor" htmlFor={name}>
                {children}
            </label>
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}

CheckBoxField.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),

    onChange: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.bool,
    error: PropTypes.string,
    sent: PropTypes.bool
};

export default CheckBoxField;
