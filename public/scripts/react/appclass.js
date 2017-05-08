import React from "react";
import DropdownComponent from "./dropdownclass";
import MosaicComponent from "./mosaicclass";
import SignUpComponent from "./signupclass";
import AddBookComponent from "./addbookclass";
import PopupComponent from "./popupclass";
import TradeComponent from "./tradesclass";
import ProfileComponent from "./profileclass";

class AppComponent extends React.Component{
  constructor(props) {
    super(props);
    var login = this.props.servertoken? true : false;
    if (login) {
      localStorage._naive_accesstoken = this.props.servertoken;
    }

    // Bind custom methods with this if they need it.
    this.hideAll = this.hideAll.bind(this);
    this.showadd = this.showadd.bind(this);
    this.showprofile = this.showprofile.bind(this);
    this.showtrades = this.showtrades.bind(this);
    this.closeadd = this.closeadd.bind(this);
    this.closeprofile = this.closeprofile.bind(this);
    this.closetrades = this.closetrades.bind(this);
    this.logout = this.logout.bind(this);
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.updateuserinfo = this.updateuserinfo.bind(this);
    this.addbook = this.addbook.bind(this);
    this.addbookfinal = this.addbookfinal.bind(this);
    this.wantfunc = this.wantfunc.bind(this);
    this.showpopup = this.showpopup.bind(this);
    this.closepopup = this.closepopup.bind(this);

    this.state = {
      username: this.props.username,
      profile: null,
      location: null,
      accesstokenserver: this.props.servertoken,
      accesstokenlocal: localStorage._naive_accesstoken,
      loggedin: true,
      showadd: false,
      showprofile: false,
      showpopup: false,
      showtrades: false,
      popuptext: '',
      booklist: []
    }
  }

  componentDidMount() {
    console.log("Component mounted");
    if (localStorage._naive_accesstoken) {
      console.log("Localstorage naive accesstoken is not null");
      // User is currently logged in
      var params = "?&accesstoken="+localStorage._naive_accesstoken;
      // tokendetails response will be bundled with bookresults.
      $.getJSON('/tokendetails/'+params, function(result) {
        console.log("fetched token details");
        this.setState({
          username: result.profile.username,
          profile: result.profile,
          location: result.profile.location,
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
  }

  hideAll() {
    this.setState({
      showadd: false,
      showprofile: false,
      showtrades: false
    })
  }

  showadd() {
    // May cause bugs because setstate is async.
    this.hideAll();
    this.setState({
      showadd: true
    });
  }

  showprofile() {
    console.log("showing profile");
    // May cause bugs because setstate is async.
    this.hideAll();
    this.setState({
      showprofile: true
    });
  }

  showtrades() {
    this.hideAll();
    this.setState({
      showtrades: true
    })
  }

  closeadd() {
    this.setState({
      showadd: false
    })
  }

  closeprofile() {
    this.setState({
      showprofile: false
    })
  }

  closetrades() {
    $.getJSON('/getbooklist/', function(result) {
      if (result.error) {
        alert("Error: " + result.error);
      } else {
        this.setState({
          showtrades: false,
          booklist: result
        })
      }
    }.bind(this))
  }

  logout() {
    // Empty localstorage
    var params = "?&accesstoken="+this.state.accesstokenserver;
    $.getJSON('/logout/'+params, function(result) {
      // localStorage._naive_accesstoken = null;
      localStorage.removeItem("_naive_accesstoken");
      this.hideAll();
      this.setState({
        username: null,
        location: null,
        profile: null,
        accesstokenserver: null,
        accesstokenlocal: null,
        loggedin: false
      });
      console.log("logged out.");
    }.bind(this));
  }

  signup(signupname, passwordhash, location, email, fullname) {
    var params = "?&username="+signupname+"&passwordhash="+passwordhash+"&location="+location+"&email="+email+"&fullname="+fullname;
    $.getJSON('/signup/'+params, function(result) {
      if (result.error) {
        // TODO: Implement better error display
        alert("Error: "+result.error);
      } else {
        console.log("Logged in. Please check local storage to verify _naive_accesstoken");
        localStorage._naive_accesstoken = result.accessToken;
        this.setState({
          username: result.profile.username,
          location: result.profile.location,
          profile: result.profile,
          accesstokenserver: result.accessToken,
          accesstokenlocal: localStorage._naive_accesstoken,
          loggedin: true,
          booklist: result.booklist
        })
      }
    }.bind(this))
  }

  login(username, passwordhash) {
    var params = "?&username="+username+"&passwordhash="+passwordhash;
    $.getJSON('/login/'+params, function(result) {
      if (result.error) {
        alert("Error: "+result.error);
      } else {
        console.log("Logged in. Please check local storage to verify _naive_accesstoken");
        localStorage._naive_accesstoken = result.accessToken;
        this.setState({
          username: result.profile.username,
          location: result.profile.location,
          profile: result.profile,
          accesstokenserver: result.accessToken,
          accesstokenlocal: localStorage._naive_accesstoken,
          loggedin: true,
          booklist: result.booklist
        });
      }
    }.bind(this))
  }

  updateuserinfo(username, newname, newlocation, userbooks) {
    var params="?&username="+username+"&newname="+newname+"&newlocation="+newlocation+"&booklist="+userbooks;
    $.getJSON('/updateuser/'+params, function(result) {
      if (result.error) {
        alert("Error: "+result.error);
      } else {
        // Expects an updated book list on success.
        this.setState({
          showprofile: false,
          booklist: result
        })
      }
    }.bind(this))
  }

  addbook(bookdata) {
    // If this book has an imageLinks object, query google first for the specific volume to get a higher resolution picture
    if (bookdata.volumeInfo.imageLinks) {
      $.getJSON(bookdata.selfLink, function(result) {
        if (result.volumeInfo.imageLinks.small) {
          bookdata.coverimage = result.volumeInfo.imageLinks.small;
        } else {
          bookdata.coverimage = result.volumeInfo.imageLinks.thumbnail;
        }
        this.addbookfinal(bookdata);
      }.bind(this))
    } else {
      bookdata.coverimage = '/images/placeholder-thumbnail.png';
      this.addbookfinal(bookdata);
    }
  }

  addbookfinal(bookdata) {
    // This JSON call expects an updated booklist on success, an error otherwise.
    var params = "?&bookdata="+encodeURIComponent(JSON.stringify(bookdata))+"&username="+this.state.username;
    $.getJSON('/addbook/'+params, function(result) {
      if (result.error) {
        alert("Error adding book: " + result.error);
      } else {
        // TODO: add an image to this.
        console.log(result);
        this.setState({showadd: false, showpopup:true, popuptext:bookdata.volumeInfo.title+" has been added to your collection", booklist: result});
      }
    }.bind(this))
  }

  wantfunc(bookid, username, bookownername, location) {
    console.log("app wants this book");
    var params="?&bookid="+bookid+"&username="+username+"&bookownername="+bookownername+"&location="+location;
    $.getJSON('/wantbook/'+params, function(result) {
      if (result.error) {
        alert("Error requesting book: " + result.error);
      } else {
        // Expects a refreshed booklist and profile in response.
        this.setState({profile: result.profile, booklist: result.booklist});
      }
    }.bind(this))
  }

  showpopup(message) {
    this.setState({showpopup:true, popuptext:message});
  }

  closepopup() {
    this.setState({showpopup: false, popuptext:''});
  }

  render() {
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
                    <DropdownComponent loggedin={this.state.loggedin} username={this.state.username} logoutfunc={this.logout} loginfunc={this.login} addbook={this.showadd} showprofile={this.showprofile} showtrades={this.showtrades}/>
                </div>
            </div>
        </nav>
        <div className="Aligner">
        {this.state.booklist !== [] && this.state.username !== null? <MosaicComponent popupfunc={this.showpopup} data={this.state.booklist} username={this.state.username} wantfunc={this.wantfunc} location={this.state.location} profile={this.state.profile}/> : null}
        {this.state.loggedin? null : <SignUpComponent signupfunc={this.signup}/>}
        {this.state.showadd? <AddBookComponent addfunc={this.addbook} closefunc={this.closeadd}/> : null }
        {this.state.showpopup? <PopupComponent content={this.state.popuptext} closefunc={this.closepopup}/> : null}
        {this.state.showtrades? <TradeComponent username={this.state.username} booklist={this.state.booklist} closefunc={this.closetrades}/> : null}
        {this.state.showprofile? <ProfileComponent username={this.state.username} closefunc={this.closeprofile} updatefunc={this.updateuserinfo} booklist={this.state.booklist}/> : null}
        </div>
      </div>
    );
  }
}

export default AppComponent;
