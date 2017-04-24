var AddBookComponent = React.createClass({
  getInitialState: function() {
    return {
      searchvalue: '',
      showerror: false,
      searchresults: '',
      selectedbook: null,
      selectedauthors: null
    };
  },
  handleChangeSearch: function(event) {
    this.setState({
      searchvalue: event.target.value,
      showerror: false
    });
  },
  submitSearch: function() {
    if (this.state.searchvalue.trim() === '') {
      this.setState({showerror: true});
    } else {
      // Search google books.
      // https://www.googleapis.com/books/v1/volumes?q=harry+potter
      $.getJSON('https://www.googleapis.com/books/v1/volumes?q='+encodeURIComponent(this.state.searchvalue), function(result) {
        this.setState({searchresults: result, selectedbook: null});
      }.bind(this))
    }
  },
  selectbook: function(bookdata) {
    this.setState({
      selectedbook: bookdata,
      selectedauthors: bookdata.volumeInfo.authors? bookdata.volumeInfo.authors.join(", ") : "Unknown"
    });
  },
  addbook: function() {
    console.log("I have this book yo");
  },
  render: function() {
    // return null;
    return (
      <div className="card bigcard">
        <h1>Add a book</h1>
        <input type="text" placeholder="Look for a book" value={this.state.searchvalue} onChange={this.handleChangeSearch}/>
        <button className="btn btn-info" onClick={this.submitSearch}>Search</button>
        {this.state.showerror? <div className="error">Please fill in all fields</div>: null}
        {this.state.searchresults !== ''?
          <ul className="list-group">
          {this.state.searchresults.items.map(function(book, i) {
            var authors
            return <BookResultComponent selectdark={this.state.selectedbook===book} data={book} key={i} selectfunc={this.selectbook}/>
          }.bind(this))}
          </ul>
          : null}
        {this.state.selectedbook?
          <div>
            <div className="card selectedcard">
              You have selected <em>{this.state.selectedbook.volumeInfo.title}</em> by <em>{this.state.selectedauthors}</em>
            </div>
            <button className="btn btn-info" onClick={this.addbook}>I have this book</button>
          </div>
          : null}
      </div>
    );
  }
})
