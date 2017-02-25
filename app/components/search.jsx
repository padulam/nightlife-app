import React from 'react';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {location: undefined};

    this._changeLocation = this._changeLocation.bind(this);
    this._submitLocation = this._submitLocation.bind(this);
  }

  _changeLocation(){
    this.setState({location: this._location.value});
  }

  _submitLocation(e){
    e.preventDefault();
    this.props.submitLocation(this.state.location);
  }

  render(){
    return(
      <form onSubmit={this._submitLocation} className="form-inline">
        <div className="form-group">
          <label htmlFor="searchZip" className="sr-only">Enter your zip code</label>
          <input type="search" onChange={this._changeLocation} ref={v => this._location = v} className="form-control" placeholder="Enter your zip code" name="zip" id="searchZip" />
        </div>
        <button className="btn btn-default" type="submit">Search</button>
      </form>
    );
  }
}