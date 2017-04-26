var TradeComponent = React.createClass({
  getInitialState: function() {
    return {
      userrequested: [],
      userbooks: [],
      selectedbook: null,
      selectedtradeuser: null,
      selectedyourbook: null
    }
  },
  componentWillMount: function() {
    // Do a get for this user's books.
    var params = "?&username="+this.props.username;
    $.getJSON('/getuserprofile'+params, function(result) {
      console.log(result);
      if (result.error) {
        alert("Error retrieving user details: " + result.error);
      } else {
        this.setState({
          userrequested: result.userrequested,
          userbooks: result.userbooks
        })
      }
    }.bind(this))
  },
  selecttrade: function(book) {
    this.setState({
      selectedbook: book
    })
  },
  selectyourbook: function(book) {
    this.setState({
      selectedyourbook: book
    })
  },
  render: function() {
    var userbooklist = [];
    this.props.booklist.forEach(function(bookdata) {
      if (this.state.userbooks.includes(bookdata._id)) {userbooklist.push(bookdata);}
    }.bind(this))
    console.log(userbooklist);
    // Show:
    // Trades in progress: your book, their book, your location, their location.
    // Books you have requested from others.
    // Books people have requested from you. (with option to propose a trade, selecting one of the incoming requests will display a dropdown of the user's books to select from).
    return (
      <div className="card bigcard tradecard">
      <button className="btn btn-blue-grey waves-effect waves-light" onClick={this.props.closefunc}>Close</button>
      <p>Trades In Progress:</p>
      LAST COMPONENT TO IMPLEMENT WOOHOO. MAKE A DEDICATED TRADES COLLECTION IN MONGO!
      <p>Incoming Requests:</p>
      {this.props.booklist.map(function(book) {
        if(this.state.userbooks.includes(book._id) && book.requestedby.length > 0) {
          return book.requestedby.map(function(requestinfo, j) {
            return <BookResultComponent key={j} data={book}
                    reqby={requestinfo}
                    source="requestedin"/>
          }.bind(this).bind(book))
        }
      }.bind(this))}
      <br/>
      <p>Outgoing Requests:<br/><em>(Select one to start proposing a trade)</em></p>
      {this.props.booklist.map(function(book, i) {
        if(this.state.userrequested.includes(book._id)) {
          return <BookResultComponent key={i} data={book}selectfunc={this.selecttrade}
                  selectdark={this.state.selectedbook === book}
                  source="requestedout"/>
        }
      }.bind(this))}
      {this.state.selectedbook?
        <div>
        <br/>
        <p> Offer One of Your Books: </p>
        {userbooklist.map(function(book, i) {
          return <BookResultComponent key={i} data={book}
                  selectfunc={this.selectyourbook}
                  selectdark={this.state.selectedyourbook === book}
                  source="yourlistintrade"/>
        }.bind(this))}
        </div>: null}
        <br/>
      {this.state.selectedbook && this.state.selectedyourbook? <button className="btn btn-info waves-effect waves-light">Propose Trade</button> : null}
        </div>
      );
    }
  })
