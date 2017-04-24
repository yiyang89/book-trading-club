var BookResultComponent = React.createClass({
  selectbook: function() {
    this.props.selectfunc(this.props.data);
  },
  render: function() {
    var imageLink = this.props.data.volumeInfo.imageLinks? this.props.data.volumeInfo.imageLinks.thumbnail : '/images/placeholder-thumbnail.png';
    var classes = this.props.selectdark? 'list-group-item selectedresult' : 'list-group-item searchresult';
    return (
      <div className={classes} onClick={this.selectbook}>
        <img src={imageLink} style={{height:"3rem"}}/>
        <div style={{marginLeft:"1rem"}}>
          {this.props.data.volumeInfo.title}
        </div>
      </div>
  );
  }
})
