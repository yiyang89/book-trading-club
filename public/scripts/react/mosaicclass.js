var MosaicComponent = React.createClass({
  render: function() {
    console.log("rendering mosaic");
    // Iterate datalist, 1 mosaicitem component for each bookdata.
    return (
      <div className="mosaic">
        {this.props.data.map(function(bookdata, key) {
          return <MosaicItemComponent data={bookdata} key={key} username={this.props.username}/>
        }.bind(this))}
      </div>
    );
  }
})
