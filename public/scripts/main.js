import React from "react";
import ReactDOM from "react-dom";
import AppComponent from "./react/appclass";

// Globals
var username = myUser;
var accessTokenFromServer = token;

ReactDOM.render(<AppComponent username={username} servertoken={accessTokenFromServer}/>, document.getElementById('app'));
