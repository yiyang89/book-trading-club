var PopupComponent = React.createClass({
  render: function() {
    return (
      <div className="card smallcard">
        {this.props.content}
        <button className="btn btn-info waves-effect waves-light" onClick={this.props.closefunc}> OK </button>
      </div>
    )
  }
})
