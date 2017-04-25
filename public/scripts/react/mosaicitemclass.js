var MosaicItemComponent = React.createClass({
  render: function() {
    // console.log("Rendering mosaicitem component");
    // console.log(this.props.data);
    // Each mosaic item component has:
    // book coverimage, title, authors, location, request button.
    //         {this.props.data.bookdata.volumeInfo.title}
    return (
      <div className="card mosaicitemcard Aligner">
        <img src={this.props.data.bookdata.coverimage}/>
        <p>
        <strong>{this.props.data.bookdata.volumeInfo.title}</strong>
        <br/>
        <em>{this.props.data.bookdata.volumeInfo.authors.join(", ")}</em>
        <br/>
        Currently located in: <em>{this.props.data.location}</em>
        </p>
        <button className="btn btn-info waves-effect waves-light">I want this book!</button>
      </div>
    );
  }
})