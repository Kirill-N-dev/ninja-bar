import React from "react";
import PropTypes from "prop-types";

const WithStyleWrapper = ({ elements }) => {
    // Для прижатия футера
    return <div className="flex-grow-1">{elements}</div>;
};

WithStyleWrapper.propTypes = {
    elements: PropTypes.object
};

export default WithStyleWrapper;
