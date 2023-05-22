import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Users from "./users";
/* import { Route, Link, Switch } from "react-router-dom"; */
/* import UserPage from "./userPage"; */
import Empty from "./empty";
import api from "../api";
import UserCard from "./userCard";

const User = ({ match }) => {
    // Получение id по клику через опциональный параметр
    const id = match.params.userId;
    // Получение {}ов юзер и профессий
    const [user, getUserById] = useState();
    useEffect(() => {
        api.users.getById(id).then((usr) => getUserById(usr));
    }, [id]);
    //
    return id ? user ? <UserCard user={user} /> : <Empty /> : <Users />;
};

User.propTypes = {
    match: PropTypes.object.isRequired
};

export default User;
