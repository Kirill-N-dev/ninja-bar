import React from "react";
import PropTypes from "prop-types";
import QualitiesList from "./qualitiesList";
import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
    return (
        <>
            <ul>
                <h1>{user.name}</h1>
                <h4>Профессия: {user.profession.name}</h4>
                <h6>
                    <QualitiesList qualities={user.qualities} />
                </h6>
                <h6>completedMeetings: {user.completedMeetings}</h6>
                <h4>Rate: {user.rate}</h4>
                <button
                    className="btn btn-outline-light"
                    style={{
                        border: "1px solid blue"
                    }}
                >
                    <Link to="/users" style={{ textDecoration: "none" }}>
                        Все пользователи
                    </Link>
                </button>
            </ul>
        </>
    );
};

UserCard.propTypes = {
    user: PropTypes.object.isRequired
};

export default UserCard;
