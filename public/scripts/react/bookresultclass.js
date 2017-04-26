var BookResultComponent = React.createClass({
  selectbook: function() {
    this.props.selectfunc(this.props.data);
  },
  selecttrade: function() {
    this.props.selectfunc(this.props.data, this.props.reqby);
  },
  selectyourbook: function() {
    this.props.selectfunc(this.props.data);
  },
  render: function() {
    // addbook and profile lists have different rendering properties.
    if (this.props.source === "add") {
      var imageLink = this.props.data.volumeInfo.imageLinks? this.props.data.volumeInfo.imageLinks.thumbnail : '/images/placeholder-thumbnail.png';
      var classes = this.props.selectdark? 'list-group-item selectedresult' : 'list-group-item searchresult';
      var clickbehaviour = this.selectbook;
      var resulttext = this.props.data.volumeInfo.title;
    } else if (this.props.source === "profile") {
      console.log(this.props.data);
      var imageLink = this.props.data.bookdata.coverimage;
      var classes = 'list-group-item';
      var clickbehaviour = null;
      // Modify resulttext for more data (eg./ places this book has been)
      var resulttext = this.props.data.bookdata.volumeInfo.title;
    } else if (this.props.source === "requestedin") {
      var imageLink = this.props.data.bookdata.coverimage;
      var classes = 'list-group-item';
      var clickbehaviour = null;
      var resulttext = (
        <div>
          {this.props.data.bookdata.volumeInfo.title}
          <br/>Book Location: <em>{this.props.data.location.toUpperCase()}</em>
          </div>);
    } else if (this.props.source === "requestedout") {
      var imageLink = this.props.data.bookdata.coverimage;
      var classes = this.props.selectdark? 'list-group-item selectedresult' : 'list-group-item searchresult';
      var clickbehaviour = this.selecttrade;
      var resulttext = (
        <div>
          {this.props.data.bookdata.volumeInfo.title}
          <br/>Book Location: <em>{this.props.data.location.toUpperCase()}</em>
        </div>);
    } else if (this.props.source === "yourlistintrade") {
      var imageLink = this.props.data.bookdata.coverimage;
      var classes = this.props.selectdark? 'list-group-item selectedresult' : 'list-group-item searchresult';
      var clickbehaviour = this.selectyourbook;
      var resulttext = this.props.data.bookdata.volumeInfo.title;
    }
    return (
      <div className={classes} onClick={clickbehaviour}>
        <div className="searchresultimagebox">
          <img src={imageLink} style={{height:"3rem", width:"2rem"}}/>
        </div>
        <div className="searchresulttext">
          {resulttext}
        </div>
      </div>
  );
  }
})
