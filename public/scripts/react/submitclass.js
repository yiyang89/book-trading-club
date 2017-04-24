var SubmitImageComponent = React.createClass({
  getInitialState: function() {
    return {
      address: '',
      description: ''
    }
  },
  isUrlValid: function(url) {
    // url validation courtesy of http://stackoverflow.com/questions/2723140/validating-url-with-jquery-without-the-validate-plugin
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
  },
  handleSubmit: function() {
    // Check if address ends in jpg or png
    if (['.jpg','.png'].includes(this.state.address.slice(this.state.address.length -4, this.state.address.length))) {
      // Check for valid url
      if (this.isUrlValid(this.state.address)) {
        if ('http:' === this.state.address.slice(0, 5).toLowerCase()) {
          var description = this.state.description === ''? 'No description' : this.state.description;
          this.props.submitfunc(this.state.address.slice(), description);
          this.setState({
            address: '',
            description: ''
          })
        } else {
          alert('Your url is not valid');
        }
      } else {
        alert('Your url is not valid');
      }
    } else {
      alert('Your image is not of an accepted format');
    }
  },
  handlechangeaddress: function(event) {
    this.setState({address: event.target.value});
  },
  handlechangedescription: function(event) {
    this.setState({description: event.target.value});
  },
  render: function() {
    var dropdown;
    if (this.props.username) {
      // <a className="dropdown-item" onClick={this.logout}>Logout</a>
      // <a className="dropdown-item" href="/auth/google">Google+ Login</a>
      // <a className="dropdown-item">Dropdown form will go here.</a>
      dropdown = (
        <li className="nav-item dropdown btn-group">
            <a className="nav-link dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Post Image</a>
            <div className="dropdown-menu dropdown dropdownsubmit" aria-labelledby="dropdownMenu1">
              <input type="url" placeholder="Link it!" value={this.state.address} onChange={this.handlechangeaddress} />
              <input type="text" placeholder="Describe it!" value={this.state.description} onChange={this.handlechangedescription} />
              <button className="btn btn-default" onClick={this.handleSubmit}>Post it!</button>
              <p className="subtext">Only JPG and PNG are accepted<br/>Only HTTP (vs HTTPS) accepted</p>
            </div>
        </li>
      );
    } else {
      dropdown = null
    }
    return dropdown;
  }
})
