import React from "react";
import MosaicItemComponent from "./mosaicitemclass";

class MosaicComponent extends React.Component{
  render() {
    console.log("rendering mosaic");
    // Iterate datalist, 1 mosaicitem component for each bookdata.
    return (
      <div className="mosaic">
        {this.props.data.map(function(bookdata, key) {
          return <MosaicItemComponent popupfunc={this.props.popupfunc} data={bookdata} key={key} username={this.props.username} profile={this.props.profile} wantfunc={this.props.wantfunc} location={this.props.location}/>
        }.bind(this))}
      </div>
    );
  }
}

export default MosaicComponent;
