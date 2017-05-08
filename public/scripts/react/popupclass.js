import React from "react";

class PopupComponent extends React.Component{
  render() {
    return (
      <div className="card smallcard">
        {this.props.content}
        <button className="btn btn-info waves-effect waves-light" onClick={this.props.closefunc}> OK </button>
      </div>
    )
  }
}

export default PopupComponent;
