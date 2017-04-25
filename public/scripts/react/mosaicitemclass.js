var MosaicItemComponent = React.createClass({
  render: function() {
    // console.log("Rendering mosaicitem component");
    // console.log(this.props.data);
    // Each mosaic item component has:
    // book coverimage, title, authors, location, request button.
    //         {this.props.data.bookdata.volumeInfo.title}
    var wantbutton = this.props.data.owner === this.props.username?
      <button className="btn btn-dark-grey waves-effect waves-light" disabled="true">Your book</button> : <button className="btn btn-info waves-effect waves-light">I want this book!</button>;
    return (
      <div className="card mosaicitemcard Aligner">
        <img src={this.props.data.bookdata.coverimage}/>
        <p>
        <strong>{this.props.data.bookdata.volumeInfo.title}</strong>
        <br/>
        <em>{this.props.data.bookdata.volumeInfo.authors.join(", ")}</em>
        </p>
        <button className="card locationcard" disabled="true">{this.props.data.location}</button>
        {wantbutton}
      </div>
    );
  }
})
