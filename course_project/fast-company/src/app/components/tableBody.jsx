import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

// ГЕНЕРАЦИЯ TD (ТЕЛА ТАБЛИЦЫ)

const TableBody = ({ usersCrop, columns }) => {
    //
    /* console.log(data); */ // data -usersCrop

    const renderContent = (item, column) => {
        if (columns[column].component) {
            const component = columns[column].component;
            if (typeof component === "function") {
                return component(item); // если компонент - функция, туда идёт юзер (item) и выполняется
            }

            return component;
        }
        // ЕСЛИ НЕТ КОМПОНЕНТА, ИЗВЛЕКАЕТСЯ ЗНАЧЕНИЕ, РАВНОЕ PATH, КОТОРОЕ РАВНО ИСКОМОМУ КЛЮЧУ DATA
        return _.get(item, columns[column].path);
    };

    // renderContent создаёт строки
    // В возврате двойная итерация, на usersCrop и параллельно на columns
    return (
        <tbody>
            {usersCrop.map((item) => (
                <tr key={item._id}>
                    {Object.keys(columns).map((column) => (
                        <td key={column}>{renderContent(item, column)}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};

TableBody.propTypes = {
    usersCrop: PropTypes.array.isRequired,
    columns: PropTypes.object.isRequired
};

export default TableBody;
