var AppComponent = React.createClass({
  getInitialState: function() {
    var login = accessTokenFromServer? true : false;
    if (login) {
      localStorage._naive_accesstoken = accessTokenFromServer;
    }
    return {
      username: username,
      accesstokenserver: accessTokenFromServer,
      accesstokenlocal: localStorage._naive_accesstoken,
      loggedin: login,
    }
  },
  componentWillMount: function() {
    if (localStorage._naive_accesstoken) {
      console.log("Localstorage twitter accesstoken is not null");
      // User is currently logged in
        $.getJSON('/tokendetails/'+localStorage._naive_accesstoken, function(result) {
          this.setState({
            username: result.profile.username,
            accesstokenserver: result.accessToken,
            accesstokenlocal: localStorage._naive_accesstoken,
            loggedin: true,
            imagearray: result.data,
            userlist: Array.from(new Set(result.data.map(function(entry) {
              return entry.postedby;
            })))
          })
        }.bind(this))
    } else {
      // $.getJSON('/api/getimages', function(result) {
      //   console.log(JSON.stringify(result));
      //   this.setState({
      //     imagearray: result,
      //     userlist: Array.from(new Set(result.map(function(entry) {
      //       return entry.postedby;
      //     })))
      //   });
      // }.bind(this))
    }
  },
  logout: function() {
    // Empty localstorage
    $.getJSON('/logout/'+accessTokenFromServer, function(result) {
      // localStorage._naive_accesstoken = null;
      localStorage.removeItem("_naive_accesstoken");
      this.setState({
        username: null,
        accesstokenserver: null,
        accesstokenlocal: null,
        loggedin: false
      });
      console.log("logged out.");
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        <nav className="navbar navbar-toggleable-md navbar-dark cyan">
            <div className="container">
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav1" aria-controls="navbarNav1" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" href="#" onClick={this.showall}>
                    <strong>Book Trading Club</strong>
                </a>
                <div className="collapse navbar-collapse" id="navbarNav1">
                    <ul className="navbar-nav mr-auto">
                    </ul>
                    <DropdownComponent loggedin={this.state.loggedin} username={this.state.username} logoutfunc={this.logout}/>
                </div>
            </div>
        </nav>
        <div className="Aligner">
        </div>
      </div>
    );
  }
});
