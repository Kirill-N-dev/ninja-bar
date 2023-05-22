import React from "react";
import NavBar from "./components/navBar";

import Main from "./components/main";
import Login from "./components/login";
/* import Users from "./components/users"; */
import { Route, Switch } from "react-router-dom";
import User from "./components/user";
import Users from "./components/users";
/* import UserPage from "./userPage";
import Empty from "./empty"; */
/* import PropTypes from "prop-types"; */

function App() {
    return (
        <div>
            <NavBar />
            <Switch>
                <Route path="/main" component={Main} />
                <Route path="/login" component={Login} />
                <Route path="/users/:userId?" component={User} />
                <Route path="/users" component={Users} />

                <Route exact path="/" component={Main} />
                <Route render={() => <>404</>} />
            </Switch>
        </div>
    );
}

/* App.propTypes = {
    props: PropTypes.obj
}; */

export default App;
