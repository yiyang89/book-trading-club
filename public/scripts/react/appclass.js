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
      loggedin: true,
      showadd: false,
      showpopup: false,
      popuptext: '',
      booklist: []
    }
  },
  componentWillMount: function() {
    console.log("Component mounted");
    if (localStorage._naive_accesstoken) {
      console.log("Localstorage twitter accesstoken is not null");
      // User is currently logged in
      var params = "?&accesstoken="+localStorage._naive_accesstoken;
      // tokendetails response will be bundled with bookresults.
      $.getJSON('/tokendetails/'+params, function(result) {
        this.setState({
          username: result.profile,
          accesstokenserver: result.accessToken,
          accesstokenlocal: localStorage._naive_accesstoken,
          loggedin: true,
          booklist: result.booklist
        })
      }.bind(this))
    } else {
      this.setState({
        loggedin: false
      })
    }
  },
  hideAll: function() {
    this.setState({
      showadd: false
    })
  },
  showadd: function() {
    this.setState({
      showadd: true
    })
  },
  logout: function() {
    // Empty localstorage
    var params = "?&accesstoken="+this.state.accesstokenserver;
    $.getJSON('/logout/'+params, function(result) {
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
  signup: function(signupname, passwordhash, location) {
    var params = "?&username="+signupname+"&passwordhash="+passwordhash+"&location="+location;
    $.getJSON('/signup/'+params, function(result) {
      if (result.error) {
        // TODO: Implement better error display
        alert("Error: "+result.error);
      } else {
        console.log("Logged in. Please check local storage to verify _naive_accesstoken");
        localStorage._naive_accesstoken = result.accessToken;
        this.setState({
          username: result.profile,
          accesstokenserver: result.accessToken,
          accesstokenlocal: localStorage._naive_accesstoken,
          loggedin: true,
          booklist: result.booklist
        })
      }
    }.bind(this))
  },
  login: function(username, passwordhash) {
    var params = "?&username="+username+"&passwordhash="+passwordhash;
    $.getJSON('/login/'+params, function(result) {
      if (result.error) {
        alert("Error: "+result.error);
      } else {
        console.log("Logged in. Please check local storage to verify _naive_accesstoken");
        localStorage._naive_accesstoken = result.accessToken;
        this.setState({
          username: result.profile.username,
          accesstokenserver: result.accessToken,
          accesstokenlocal: localStorage._naive_accesstoken,
          loggedin: true,
          booklist: result.booklist
        });
      }
    }.bind(this))
  },
  addbook: function(bookdata) {
    // this.setState({showadd: false, showpopup:true, popuptext:bookdata.volumeInfo.title+" has been added to your collection"});
    var params = "?&bookdata="+bookdata+"&username="+this.state.username;
    $.getJSON('/addbook/'+params, function(result) {
      if (result.error) {
        alert("Error adding book: " + result.error);
      } else {
        // TODO: add an image to this.
        this.setState({showadd: false, showpopup:true, popuptext:bookdata.volumeInfo.title+" has been added to your collection"});
      }
    }.bind(this))
  },
  closepopup: function() {
    this.setState({showpopup: false, popuptext:''});
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
                    <DropdownComponent loggedin={this.state.loggedin} username={this.state.username} logoutfunc={this.logout} loginfunc={this.login} addbook={this.showadd}/>
                </div>
            </div>
        </nav>
        <div className="Aligner">
        {this.state.loggedin? null : <SignUpComponent signupfunc={this.signup}/>}
        {this.state.showadd? <AddBookComponent addfunc={this.addbook}/> : null }
        {this.state.showpopup? <PopupComponent content={this.state.popuptext} closefunc={this.closepopup}/> : null}
        </div>
      </div>
    );
  }
});
