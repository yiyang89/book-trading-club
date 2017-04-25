var AddBookComponent = React.createClass({
  getInitialState: function() {
    return {
      searchvalue: '',
      showerror: false,
      searchresults: '',
      selectedbook: null,
      selectedauthors: null,
      searchoffset: 0,
    };
  },
  componentDidMount: function() {
    this.setState({
      searchvalue: '',
      showerror: false,
      searchresults: '',
      selectedbook: null,
      selectedauthors: null,
      searchoffset: 0
    });
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
      $.getJSON('https://www.googleapis.com/books/v1/volumes?q='+encodeURIComponent(this.state.searchvalue)+"&startIndex="+this.state.searchoffset, function(result) {
        this.setState({searchresults: result});
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
    this.props.addfunc(this.state.selectedbook);
  },
  offsetNext: function() {
    this.setState({searchoffset: this.state.searchoffset+=10}, this.submitSearch);
  },
  offsetPrevious: function() {
    this.setState({searchoffset: this.state.searchoffset-=10}, this.submitSearch);
  },
  render: function() {
    var nextdisable = false;
    var previousdisable = this.state.searchoffset===0? true : false;
    if (!this.state.searchresults.items) {
      nextdisable = true;
    }
    return (
      <div className="card bigcard">
        <h1>Add a book</h1>
        <input type="text" placeholder="Look for a book" value={this.state.searchvalue} onChange={this.handleChangeSearch}/>
        <button className="btn btn-info waves-effect waves-light" onClick={this.submitSearch}>Search</button>
        <button className="btn btn-blue-grey waves-effect waves-light" onClick={this.props.closefunc}>Close</button>
        {this.state.showerror? <div className="error">Please fill in all fields</div>: null}
        {this.state.searchresults !== ''?
          <div>
            <div className="btn-row">
              <button className="btn btn-info waves-effect waves-light" disabled={previousdisable} onClick={this.offsetPrevious}>Previous</button>
              <button className="btn btn-info waves-effect waves-light" disabled={nextdisable} onClick={this.offsetNext}>Next</button>
            </div>
            <ul className="list-group">
            {this.state.searchresults.items.map(function(book, i) {
              var authors
              return <BookResultComponent source="add" selectdark={this.state.selectedbook===book} data={book} key={i} selectfunc={this.selectbook}/>
            }.bind(this))}
            </ul>
          </div>
          : null}
        {this.state.selectedbook?
          <div>
            <div className="card selectedcard">
              You have selected <em>{this.state.selectedbook.volumeInfo.title}</em> by <em>{this.state.selectedauthors}</em>
            </div>
            <button className="btn btn-info waves-effect waves-light" onClick={this.addbook}>I have this book</button>
          </div>
          : null}
      </div>
    );
  }
})
