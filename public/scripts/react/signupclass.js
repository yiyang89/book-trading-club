var SignUpComponent = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: '',
      confirmpassword: '',
      location: '',
      nomatch: false,
      emptyfields: false
    }
  },
  handleChangeUsername: function(event) {
    this.setState({username: event.target.value});
  },
  handleChangePassword: function(event) {
    this.setState({password: event.target.value});
  },
  handleChangeConfirm: function(event) {
    this.setState({confirmpassword: event.target.value});
  },
  handleChangeLocation: function(event) {
    this.setState({location: event.target.value});
  },
  submit: function() {
    // Check that passwords match
    if (this.state.username.trim() === '' || this.state.password.trim() === '' || this.state.confirmpassword.trim() ===  '' || this.state.location.trim() === '') {
      this.setState({emptyfields: true, nomatch: false});
    } else if (this.state.password !== this.state.confirmpassword) {
      this.setState({emptyfields: false, nomatch: true});
    } else {
      this.setState({emptyfields: false, nomatch: false});
      // Hash the password, send it to signupfunc with this username.
      // SHA-1 hashing compliments of https://github.com/emn178/js-sha1
      this.props.signupfunc(this.state.username, sha1(this.state.password), this.state.location);
    }
  },
  render: function() {
    return (
      <div className="Aligner card signup">
        <div className="card-contents grid-by-rows">
         <input type="text" placeholder="Create a username" value={this.state.username} onChange={this.handleChangeUsername} />
         <input type="password" placeholder="Create a password" value={this.state.password} onChange={this.handleChangePassword}/>
         <input type="password" placeholder="Confirm your password" value={this.state.confirmpassword} onChange={this.handleChangeConfirm}/>
         <input type="text" placeholder="Where are you from?" value={this.state.location} onChange={this.handleChangeLocation}/>
         <button className="btn btn-info" onClick={this.submit}>Sign Up!</button>
       </div>
       {this.state.emptyfields? <div className="error">Please fill in all fields</div> :null}
       {this.state.nomatch? <div className="error">Passwords do not match</div> :null}
      </div>
    );
  }
})
