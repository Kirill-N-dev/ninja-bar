import React, { useState } from "react";
import PropTypes from "prop-types";

export const ThemeContext = React.createContext();

const WithThemes = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem("theme"));

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

WithThemes.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default WithThemes;
