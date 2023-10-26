import React from "react";
import PropTypes from "prop-types";

const Pagination = ({ pages, page, handlePaginate }) => {
    //

    if (pages.length !== 1) {
        return (
            <div>
                <nav aria-label="Пример навигации по страницам">
                    <ul className="pagination justify-content-center mt-5">
                        <li className="page-item" data-name="back">
                            <a
                                className="page-link"
                                onClick={(ev) => handlePaginate(ev)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-arrow-left"
                                    viewBox="-3 3 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                                    />
                                </svg>
                            </a>
                        </li>
                        {pages.map((p) => (
                            <li
                                className={
                                    "page-item" +
                                    `${page === p ? " active" : ""}`
                                }
                                data-name="page"
                                key={p}
                            >
                                <a
                                    className="page-link"
                                    onClick={(ev) => handlePaginate(ev)}
                                >
                                    {p}
                                </a>
                            </li>
                        ))}
                        <li className="page-item" data-name="forward">
                            <a
                                className="page-link"
                                onClick={(ev) => handlePaginate(ev)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-arrow-right"
                                    viewBox="3 3 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                                    />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
};

Pagination.propTypes = {
    handlePaginate: PropTypes.func,
    pages: PropTypes.array,
    page: PropTypes.number
};

export default Pagination;
