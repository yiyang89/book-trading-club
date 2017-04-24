// Front end rendering and logic
// Use React and jQuery

// Globals
var username = myUser;
var accessTokenFromServer = token;

// if (accessTokenFromServer !== null) {
//   localStorage._decky_accesstoken = JSON.stringify(accessTokenFromServer);
// }
//
// // Check localstorage for auth token.
// var accessTokenFromLocal = JSON.parse(localStorage._decky_accesstoken);
//
// if (accessTokenFromLocal !== null && accessTokenFromLocal !== undefined) {
//   // Exists, make REST call for details.
//   $.getJSON('/tokendetails/'+accessTokenFromLocal, function(result) {
//     loginstatus = true;
//     console.log(result);
//     ReactDOM.render(<StatusComponent name={result.profile.name.givenName} token={result.accessToken.slice(0, 15)}/>, document.getElementById('authStatus'));
//     ReactDOM.render(<DropdownComponent name={result.profile.name.givenName} token={result.accessToken}/>, document.getElementById('dropdownReact'));
//   })
// } else {
//   // Does not exist or is null, render standard page.
//   ReactDOM.render(<StatusComponent />, document.getElementById('authStatus'));
//   ReactDOM.render(<DropdownComponent />, document.getElementById('dropdownReact'));
// }

ReactDOM.render(<AppComponent/>, document.getElementById('app'));
