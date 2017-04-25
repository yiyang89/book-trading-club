var ProfileComponent = React.createClass({
  getInitialState: function() {
    return {
      username: null,
      location: null,
      booklist: null,
      fullname: null,
      newLocation: '',
      newname: '',
      enablechange: false
    }
  },
  componentWillMount: function() {
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
          location: result.location,
          booklist: userbooksdetails
        })
      }
    }.bind(this))
  },
  updateInfo: function() {
    // Make json call to update data. This should flow through appcomponent so the mosaic can be updated with new location as well.
  },
  handleLocationChange: function(event) {
    this.setState({
      newLocation: event.target.value
    })
  },
  handleNameChange: function(event) {
    this.setState({
      newname: event.target.value
    })
  },
  toggleChange: function() {
    this.setState({
      enablechange: !this.state.enablechange
    })
  },
  render: function() {
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
        <button className={buttonclass} onClick={this.toggleChange}>{buttontext}</button>
        {this.state.enablechange? <button className='btn btn-info waves-effect waves-light' onClick={this.updateInfo}>Save Changes</button> : null}
        <h3>Your Books: </h3>
        <ul className="list-group">
          {booklist}
        </ul>
      </div>
    );
  }
})
