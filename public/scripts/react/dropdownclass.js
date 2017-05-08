import React from "react";
import sha1 from "../sha1";

class DropdownComponent extends React.Component{
  constructor(props) {
    super(props);

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {username: '', password: ''};
  }

  handleChangeUsername(event) {
    this.setState({username: event.target.value});
  }

  handleChangePassword(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit() {
    // Check that fields are not empty.
    if (this.state.username.trim() === '' || this.state.password.trim() === '') {
      alert('Please fill in all login fields');
    } else {
      this.props.loginfunc(this.state.username.slice(), sha1(this.state.password.slice()));
      this.setState({username: '', password: ''});
    }
  }

  render() {
    // If logged in, display dropdown.
    // Else, display sign up and log in options.
    var navlinks;
    if (this.props.username) {
      navlinks = (
        <li className="nav-item dropdown btn-group">
            <a className="nav-link dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.props.username}</a>
            <div className="dropdown-menu dropdown dropdownloggedin" aria-labelledby="dropdownMenu1">
              <a className="dropdown-item" onClick={this.props.addbook}>Add Book</a>
              <a className="dropdown-item" onClick={this.props.showprofile}>Profile</a>
              <a className="dropdown-item" onClick={this.props.showtrades}>Requests/Trades</a>
              <a className="dropdown-item" onClick={this.props.logoutfunc}>Logout</a>
            </div>
        </li>
      );
    } else {
      navlinks = (
        <li className="nav-item dropdown btn-group">
            <a className="nav-link dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Login</a>
            <div className="dropdown-menu dropdown dropdownsubmit" aria-labelledby="dropdownMenu1">
              <input type="text" placeholder="Username" value={this.state.username} onChange={this.handleChangeUsername} />
              <input type="password" placeholder="Password" value={this.state.password} onChange={this.handleChangePassword} />
              <button className="btn btn-default waves-effect waves-light" onClick={this.handleSubmit}>Login</button>
            </div>
        </li>
      );
    }
    return navlinks;
  }
}

export default DropdownComponent;
