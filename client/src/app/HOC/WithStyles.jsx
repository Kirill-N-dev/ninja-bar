import React from "react";
import PropTypes from "prop-types";

const WithStyles = ({ elements }) => {
    // Для прижатия футера
    return <div className="flex-grow-1">{elements}</div>;
};

WithStyles.propTypes = {
    elements: PropTypes.object
};

export default WithStyles;
