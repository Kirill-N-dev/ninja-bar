import React from "react";
import PropTypes from "prop-types";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
import BookMark from "./bookmark";
import QualitiesList from "./qualitiesList";
import Table from "./table";
import { Link } from "react-router-dom";
/* import User from "./user"; */

// ОБЪЕКТ ДЛЯ ИТЕРАЦИИ COLUMNS, СБОРКА HEADER И BODY

const UsersTable = ({
    users,
    onSort,
    selectedSort,
    onToggleBookMark,
    onDelete,
    ...rest
}) => {
    //
    // КАК columns ЭКСПОРТИРОВАТЬ В USER?
    //
    const columns = {
        name: {
            path: "name",
            name: "Имя",
            component: (user) => (
                <Link to={`/users/${user._id}`}> {user.name} </Link>
            )
        },
        qualities: {
            name: "Качества",
            component: (user) => <QualitiesList qualities={user.qualities} />
        },
        professions: {
            path: "profession.name",
            name: "Профессия"
        },
        completedMeetings: {
            path: "completedMeetings",
            name: "Встретился, раз"
        },
        rate: { path: "rate", name: "Оценка" },
        bookmark: {
            /* path: "bookmark", */
            // Макс, если делать сортировку не покидая currentPage, баг остаётся, потому я её отключил
            name: "Избранное",

            component: (user) => (
                <BookMark
                    status={user.bookmark}
                    onClick={() => onToggleBookMark(user._id)}
                />
            )
        },
        delete: {
            component: (user) => (
                <button
                    onClick={() => onDelete(user._id)}
                    className="btn btn-danger"
                >
                    delete
                </button>
            )
        }
    };

    //

    return (
        <Table>
            <TableHeader
                {...{
                    onSort,
                    selectedSort,
                    columns
                }}
            />
            <TableBody {...{ columns, usersCrop: users }} />
        </Table>
        /* <Table
            onSort={onSort}
            selectedSort={selectedSort}
            columns={columns}
            data={users}
        /> */
    );
};

UsersTable.propTypes = {
    users: PropTypes.array.isRequired,
    onSort: PropTypes.func.isRequired,
    selectedSort: PropTypes.object.isRequired,
    bookmark: PropTypes.bool,
    onToggleBookMark: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default UsersTable;
