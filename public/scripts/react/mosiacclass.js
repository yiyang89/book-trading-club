var MosaicComponent = React.createClass({
  // fisher yates shuffle from: https://www.frankmitchell.org/2015/01/fisher-yates/
  // shuffle: function(array) {
  //   var i = 0
  //   var j = 0
  //   var temp = null
  //
  //   for (i = array.length - 1; i > 0; i -= 1) {
  //     j = Math.floor(Math.random() * (i + 1))
  //     temp = array[i]
  //     array[i] = array[j]
  //     array[j] = temp
  //   }
  // },
  render: function() {
    // Filter here for even distribution.
    // My uploads
    // My Pins
    // Target user uploads
    var datacopy = this.props.data.slice();
    // this.shuffle(datacopy);
    var indextoremove = [];
    for (var i = 0; i < datacopy.length; i++) {
      if (this.props.mypins && (!datacopy[i].likeData.includes(this.props.username))) {
        indextoremove.push(i);
      } else if (this.props.myuploads && (datacopy[i].postedby !== this.props.username)) {
        indextoremove.push(i);
      } else if (this.props.useruploads && (datacopy[i].postedby !== this.props.uploadedname)) {
        indextoremove.push(i)
      }
    }
    for (var i = indextoremove.length - 1; i >= 0; i--) {
      datacopy.splice(indextoremove[i], 1);
    }
    var masonrytemp = {'0': [0, []], '1':[0, []], '2':[0, []], '3':[0, []], '4': [0, []]};
    // Push into the column with the smallest height.
    for (var i = 0; i < datacopy.length; i++) {
      var heights = Object.keys(masonrytemp).map(function(key) {
        return masonrytemp[key][0];
      });
      var minheightindex = 0;
      var value = heights[0];
      for (var j = 1; j < heights.length; j++) {
        if (heights[j] < value) {
          value = heights[j];
          minheightindex = j;
        }
      }
      // Insert into this column. Update the height value for this column.
      masonrytemp[minheightindex][1].push(
        <CardComponent carddata={datacopy[i]} key={i} username={this.props.username} uploadedname={this.props.uploadedname} pinfunc={this.props.pinfunc} unpinfunc={this.props.unpinfunc} deletefunc={this.props.deletefunc} showmypins={this.props.mypins} showmyuploads={this.props.myuploads} showuseruploads={this.props.useruploads}/>
      );
      if (datacopy[i].height) {
        masonrytemp[minheightindex][0] += datacopy[i].height;
      } else {
        // Dimensions of the placeholder image.
        masonrytemp[minheightindex][0] += (133.69/252.84);
      }
    }


    // for (var i = 0; i < datacopy.length; i++) {
    //   masonrytemp[i % 5].push(
    //     <CardComponent carddata={datacopy[i]} key={i} username={this.props.username} uploadedname={this.props.uploadedname} pinfunc={this.props.pinfunc} unpinfunc={this.props.unpinfunc} deletefunc={this.props.deletefunc} showmypins={this.props.mypins} showmyuploads={this.props.myuploads} showuseruploads={this.props.useruploads}/>
    //     );
    // }
    return (
      <div className="grid-by-columns">
        <div className="grid-by-rows">{masonrytemp[0][1]}</div>
        <div className="grid-by-rows">{masonrytemp[1][1]}</div>
        <div className="grid-by-rows">{masonrytemp[2][1]}</div>
        <div className="grid-by-rows">{masonrytemp[3][1]}</div>
        <div className="grid-by-rows">{masonrytemp[4][1]}</div>
      </div>
      );
    }

  // render: function() {
  //   // Divide items between 5 columns.
  //   console.log("rerendering mosaic");
  //   var masonrytemp = {'0': [], '1':[], '2':[], '3':[], '4': []};
  //   for (var i = 0; i < this.props.data.length; i++) {
  //     masonrytemp[i % 5].push(
  //       <CardComponent carddata={this.props.data[i]} key={i} username={this.props.username} uploadedname={this.props.uploadedname} pinfunc={this.props.pinfunc} unpinfunc={this.props.unpinfunc} deletefunc={this.props.deletefunc} showmypins={this.props.mypins} showmyuploads={this.props.myuploads} showuseruploads={this.props.useruploads}/>
  //       );
  //   }
  //   return (
  //     <div className="grid-by-columns">
  //       <div className="grid-by-rows">{masonrytemp[0]}</div>
  //       <div className="grid-by-rows">{masonrytemp[1]}</div>
  //       <div className="grid-by-rows">{masonrytemp[2]}</div>
  //       <div className="grid-by-rows">{masonrytemp[3]}</div>
  //       <div className="grid-by-rows">{masonrytemp[4]}</div>
  //     </div>
  //     );
  // }
})

// Placeholder image courtesy of http://www.jennybeaumont.com/post-placeholders/
