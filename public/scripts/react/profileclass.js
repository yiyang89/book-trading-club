import React from "react";
import BookResultComponent from "./bookresultclass";

class ProfileComponent extends React.Component{
  constructor(props) {
    super(props);

    this.updateInfo = this.updateInfo.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.toggleChange = this.toggleChange.bind(this);

    this.state = {
      username: null,
      location: null,
      booklist: [],
      fullname: null,
      newLocation: '',
      newname: '',
      enablechange: false,
      showerror: false
    }
  }

  componentDidMount() {
    var params = "?&username="+this.props.username;
    $.getJSON('/getuserprofile/'+params, function(result) {
      console.log(result);
      if (result.error) {
        alert("Error retrieving user details: "+result.error);
      } else {
        // Filter this.props.booklist using result.userbooks.
        var userbooksdetails = this.props.booklist.filter(function(book) {
          return result.userbooks.includes(book._id);
        });
        this.setState({
          username: result.username,
          fullname: result.fullname,
          location: result.location,
          booklist: userbooksdetails
        })
      }
    }.bind(this))
  }

  updateInfo() {
    // Make json call to update data. This should flow through appcomponent so the mosaic can be updated with new location as well.
    if (this.state.newLocation.trim() === '' || this.state.newname.trim() === '') {
      this.setState({
        showerror: true
      })
    } else {
      var bookids = this.state.booklist.map(function(book) {
        return book._id;
      });
      this.props.updatefunc(this.state.username, this.state.newname, this.state.newLocation, encodeURIComponent(JSON.stringify(bookids)));
    }
  }

  handleLocationChange(event) {
    this.setState({
      newLocation: event.target.value,
      showerror: false
    })
  }

  handleNameChange(event) {
    this.setState({
      newname: event.target.value,
      showerror: false
    })
  }

  toggleChange() {
    this.setState({
      newLocation: '',
      newname: '',
      enablechange: !this.state.enablechange,
      showerror: false
    })
  }

  render() {
    // Profile contents:
    // Username, location, location change, list of books
    var usernameinput = <input type="text" value={this.state.username} disabled="true"/>;
    var nameinput = this.state.enablechange? <input type="text" placeholder={this.state.fullname} onChange={this.handleNameChange} value={this.state.newname}/> : <input type="text" value={this.state.fullname} disabled="true"/>;
    var locationinput = this.state.enablechange? <input type="text" placeholder={this.state.location} onChange={this.handleLocationChange} value={this.state.newLocation}/> : <input type="text" value={this.state.location} disabled="true"/>;
    var buttontext = this.state.enablechange? "Cancel" : "Enable Changes";
    var buttonclass = this.state.enablechange? "btn btn-blue-grey waves-effect waves-light" : "btn btn-info waves-effect waves-light";
    var booklist = this.state.booklist?
      this.state.booklist.map(function(book, i) {
        return <BookResultComponent source="profile" data={book} key={i}/>
      }) : null;
    return (
      <div className="card bigcard profilecard">
        <div className="description-row profilerow">
          Username: {usernameinput}
        </div>
        <div className="description-row profilerow">
          Name: {nameinput}
          </div>
        <div className="description-row profilerow">
          Location: {locationinput}
        </div>
        {this.state.showerror? <div className="error">Please fill out the location and name fields</div>:null}
        <button className={buttonclass} onClick={this.toggleChange}>{buttontext}</button>
        {this.state.enablechange? <button className='btn btn-info waves-effect waves-light' onClick={this.updateInfo}>Save Changes</button> : null}
        <button className="btn btn-blue-grey waves-effect waves-light" onClick={this.props.closefunc}>Close</button>
        <h3>Your Books: </h3>
        <ul className="list-group">
          {booklist}
        </ul>
      </div>
    );
  }
}

export default ProfileComponent;
