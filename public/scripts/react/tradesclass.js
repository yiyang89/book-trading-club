import React from "react";
import BookResultComponent from "./bookresultclass";
import TradeResultComponent from "./traderesultclass";

class TradeComponent extends React.Component{
  constructor(props) {
    super(props);

    this.selecttrade = this.selecttrade.bind(this);
    this.selectyourbook = this.selectyourbook.bind(this);
    this.setuptrade = this.setuptrade.bind(this);
    this.rejecttrade = this.rejecttrade.bind(this);
    this.accepttrade = this.accepttrade.bind(this);
    this.tradedetails = this.tradedetails.bind(this);

    this.state = {
      userrequested: [],
      userbooks: [],
      selectedbook: null,
      selectedyourbook: null,
      tradeslist: [],
      selectedtrade: null
    }
  }

  componentDidMount() {
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
    $.getJSON('/gettradeslist/', function(result) {
      if (result.error) {
        alert("Error retrieving trade list: " + result.error);
      } else {
        this.setState({tradeslist: result});
      }
    }.bind(this))
  }

  selecttrade(book) {
    this.setState({
      selectedbook: book
    })
  }

  selectyourbook(book) {
    this.setState({
      selectedyourbook: book
    })
  }

  setuptrade() {
    var params = "?&targetbookdata="+encodeURIComponent(JSON.stringify(this.state.selectedbook))
    +"&userbookdata="+encodeURIComponent(JSON.stringify(this.state.selectedyourbook))
    +"&ownername="+this.state.selectedbook.owner
    +"&username="+this.props.username;
    $.getJSON('/setuptrade/'+params, function(result) {
      if (result.error) {
        alert("Error setting up trade: " + result.error);
      } else {
        // Expects an updated trades list.
        this.setState({
          tradeslist: result,
          selectedbook: null,
          selectedyourbook: null
        })
      }
    }.bind(this))
  }

  rejecttrade(tradeid) {
    var params="?&tradeid="+tradeid;
    $.getJSON('/rejecttrade/'+params, function(result) {
      if (result.error) {
        alert("Error rejecting trade: " + result.error);
      } else {
        // Expects an updated trades list.
        this.setState({tradeslist: result})
      }
    }.bind(this))
  }

  accepttrade(tradeid) {
    // ON SERVER ON ACCEPT TRADE: EXISTING OPEN TRADES INVOLVING EITHER BOOK MUST BE REMOVED.
    var params="?&tradeid="+tradeid;
    $.getJSON('/accepttrade/'+params, function(result) {
      if (result.error) {
        alert("Error accepting trade: " + result.error);
      } else {
        // Expects an updated trades list.
        this.setState({tradeslist: result})
      }
    }.bind(this))
  }

  tradedetails(trade) {
    this.setState({
      selectedtrade: trade
    })
  }

  render() {
    var userbooklist = [];
    this.props.booklist.forEach(function(bookdata) {
      if (this.state.userbooks.includes(bookdata._id)) {userbooklist.push(bookdata);}
    }.bind(this))
    console.log(userbooklist);
    var incomingtradeslist = [];
    var outgoingtradeslist = [];
    this.state.tradeslist.forEach(function(tradedata) {
      if (tradedata.recipient.username === this.props.username) {
        incomingtradeslist.push(tradedata);
      } else if (tradedata.proposer.username === this.props.username) {
        outgoingtradeslist.push(tradedata);
      }
    }.bind(this));
    // Show:
    // Trades in progress: your book, their book, your location, their location.
    // Books you have requested from others.
    // Books people have requested from you. (with option to propose a trade, selecting one of the incoming requests will display a dropdown of the user's books to select from).
    return (
      <div className="card bigcard tradecard">
      <button className="btn btn-blue-grey waves-effect waves-light" onClick={this.props.closefunc}>Close</button>
      {incomingtradeslist.length > 0?
        (<div>
          <p>Incoming Trade Proposals:</p>
          <ul className="list-group">
          {incomingtradeslist.map(function(tradedata, i) {
            return <TradeResultComponent completedfunc={this.accepttrade} rejectedfunc={this.rejecttrade} key={i} source="incoming" data={tradedata} selected={this.state.selected === tradedata} selectfunc={this.selecttrade}/>
          }.bind(this))}
          </ul>
          </div>) : null
        }
        {outgoingtradeslist.length > 0?
          (<div>
            <br/>
            <p>Outgoing Trade Proposals:</p>
            <ul className="list-group">
            {outgoingtradeslist.map(function(tradedata, i) {
              return <TradeResultComponent key={i} source="outgoing" data={tradedata} selected={this.state.selected === tradedata} selectfunc={this.selecttrade}/>
            }.bind(this))}
            </ul>
            <br/>
            </div>) : null
          }
          <p>Incoming Book Requests:</p>
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
          <p>Outgoing Book Requests:<br/><em>(Select one to start proposing a trade)</em></p>
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
            {this.state.selectedbook && this.state.selectedyourbook?
              <div>
              <em>If you propose a trade your email addresses will be exposed to one another</em>
              <button className="btn btn-info waves-effect waves-light" onClick={this.setuptrade}>Propose Trade</button>
              </div> : null}
              </div>
            );
          }
        }

        export default TradeComponent;
