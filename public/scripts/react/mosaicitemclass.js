var MosaicItemComponent = React.createClass({
  wantclick: function() {
    console.log("i want this book");
    this.props.wantfunc(this.props.data._id, this.props.username, this.props.data.owner, this.props.location);
  },
  render: function() {
    // console.log("Rendering mosaicitem component");
    // console.log(this.props.data);
    // Each mosaic item component has:
    // book coverimage, title, authors, location, request button.
    //         {this.props.data.bookdata.volumeInfo.title}
    // var wantbutton = this.props.data.owner === this.props.username?
      // <button className="btn btn-dark-grey waves-effect waves-light" disabled="true">Your book</button> : <button className="btn btn-info waves-effect waves-light" onClick={this.wantclick}>I want this book!</button>;
    var wantbutton;
    console.log(this.props.profile);
    if (this.props.data.owner === this.props.username) {
      wantbutton = <button className="btn btn-dark-grey waves-effect waves-light" disabled="true">Your book</button>;
    // } else if (this.props.data.requestedby && this.props.data.requestedby.map(function(result){return result.username}).includes(this.props.username)) {
    } else if (this.props.profile.userrequested.includes(this.props.data._id)) {
      wantbutton = <button className="btn btn-info waves-effect waves-light" disabled="true">Requested</button>;
    } else {
      wantbutton = <button className="btn btn-info waves-effect waves-light" onClick={this.wantclick}>I want this book!</button>;
    }
    return (
      <div className="card mosaicitemcard Aligner">
        <img src={this.props.data.bookdata.coverimage}/>
        <p>
        <strong>{this.props.data.bookdata.volumeInfo.title}</strong>
        <br/>
        <em>{this.props.data.bookdata.volumeInfo.authors? this.props.data.bookdata.volumeInfo.authors.join(", ") : 'Unknown'}</em>
        </p>
        <button className="card locationcard" disabled="true">{this.props.data.location}</button>
        {wantbutton}
      </div>
    );
  }
})
