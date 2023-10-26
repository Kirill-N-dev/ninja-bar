import React from "react";
import PropTypes from "prop-types";

const RadioField = ({ options, name, onChange, value, label }) => {
    //
    const handleChange = (ev) => {
        onChange({ name: ev.target.name, value: ev.target.value });
    };
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
                            className="form-check-input cursor"
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
    label: PropTypes.string
};

export default RadioField;
