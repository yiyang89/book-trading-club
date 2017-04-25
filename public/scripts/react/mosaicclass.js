var MosaicComponent = React.createClass({
  render: function() {
    console.log("rendering mosaic");
    // Iterate datalist, 1 mosaicitem component for each bookdata.
    return (
      <div className="mosaic">
        {this.props.data.map(function(bookdata, key) {
          return <MosaicItemComponent data={bookdata} key={key} username={this.props.username} wantfunc={this.props.wantfunc} location={this.props.location}/>
        }.bind(this))}
      </div>
    );
  }
})
