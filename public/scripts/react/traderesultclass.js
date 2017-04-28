var TradeResultComponent = React.createClass({
  completetrade: function() {
    this.props.completedfunc(this.props.data._id);
  },
  rejecttrade: function() {
    this.props.rejectedfunc(this.props.data._id);
  },
  render: function() {
    // each trade result will show:
    // from book and too book.
    // email of the other party.
    // if open: show accept button, reject button, useremail. white hue.
    // if rejected: no buttons, no email. red hue.
    // if complete: no buttons, no email. green hue.
    // TODO: Refactor. Most of the lines for incoming can be grouped into one if. Same for outgoing.
    var mybookjsx;
    var theirbookjsx;
    var tradedetails;
    var itemclass;
    if (this.props.source === "incoming") {
      mybookjsx = <div className='tradeitem'>
          <img src={this.props.data.targetbook.bookdata.coverimage} style={{height:"3rem", width:"2rem", marginRight:"1rem"}}/>
          Yours
          <br/>
          {this.props.data.targetbook.bookdata.volumeInfo.title}
      </div>
      theirbookjsx = <div className='tradeitem'>
          <img src={this.props.data.offerbook.bookdata.coverimage} style={{height:"3rem", width:"2rem", marginRight:"1rem"}}/>
          Theirs
          <br/>
          {this.props.data.offerbook.bookdata.volumeInfo.title}
      </div>
      if (this.props.data.status === 'open') {
        itemclass = 'list-group-item';
        // open incoming trades have buttons to accept or reject trades.
        tradedetails =
          (<div style={{width:"100%"}}>
            <strong>Discuss this trade: {this.props.data.proposer.email}</strong><br/>
            <button onClick={this.completetrade} className="btn btn-success waves-effect waves-light" style={{width:"40%", margin:"1rem"}}>Completed</button>
            <button onClick={this.rejecttrade} className="btn btn-danger waves-effect waves-light" style={{width:"40%", margin:"1rem"}}>Rejected</button>
          </div>)
      } else if (this.props.data.status === 'rejected') {
        itemclass = 'list-group-item rejectedtrade';
        tradedetails = <div style={{width:"100%"}}>You have rejected this trade</div>;
      } else if (this.props.data.status === 'completed') {
        itemclass = 'list-group-item completedtrade';
        tradedetails = <div style={{width:"100%"}}>Completed</div>;
      } else if (this.props.data.status === 'nolongerheld') {
        itemclass = 'list-group-item rejectedtrade';
        tradedetails = <div style={{width:"100%"}}>A party involved no longer holds their book</div>;
      }
    } else if (this.props.source === "outgoing") {
      mybookjsx = <div className='tradeitem'>
          <img src={this.props.data.offerbook.bookdata.coverimage} style={{height:"3rem", width:"2rem", marginRight:"1rem"}}/>
          Yours
          <br/>
          {this.props.data.offerbook.bookdata.volumeInfo.title}
      </div>
      theirbookjsx = <div className='tradeitem'>
          <img src={this.props.data.targetbook.bookdata.coverimage} style={{height:"3rem", width:"2rem", marginRight:"1rem"}}/>
          Theirs
          <br/>
          {this.props.data.targetbook.bookdata.volumeInfo.title}
      </div>
      if (this.props.data.status === 'open') {
        itemclass = 'list-group-item';
        tradedetails = <div style={{width:"100%"}}><strong>Discuss this trade: {this.props.data.recipient.email}</strong></div>
      } else if (this.props.data.status === 'rejected') {
        itemclass = 'list-group-item rejectedtrade';
        tradedetails = <div style={{width:"100%"}}>The other user has rejected this trade</div>;
      } else if (this.props.data.status === 'completed') {
        itemclass = 'list-group-item completedtrade';
        tradedetails = <div style={{width:"100%"}}>Completed</div>;
      } else if (this.props.data.status === 'nolongerheld') {
        itemclass = 'list-group-item rejectedtrade';
        tradedetails = <div style={{width:"100%"}}>A party involved no longer holds their book</div>;
      }
    }
    // return null;
    return(
      <div className={itemclass}>
        {mybookjsx}
        {theirbookjsx}
        {tradedetails}
      </div>
    )
  }
})
