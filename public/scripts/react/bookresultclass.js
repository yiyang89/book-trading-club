var BookResultComponent = React.createClass({
  selectbook: function() {
    this.props.selectfunc(this.props.data);
  },
  render: function() {
    var imageLink = this.props.data.volumeInfo.imageLinks? this.props.data.volumeInfo.imageLinks.thumbnail : '/images/placeholder-thumbnail.png';
    var classes = this.props.selectdark? 'list-group-item selectedresult' : 'list-group-item searchresult';
    return (
      <div className={classes} onClick={this.selectbook}>
        <div className="searchresultimagebox">
          <img src={imageLink} style={{height:"3rem"}}/>
        </div>
        <div className="searchresulttext">
          {this.props.data.volumeInfo.title}
        </div>
      </div>
  );
  }
})
