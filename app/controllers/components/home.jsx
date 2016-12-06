import React from 'react';
import ajaxFunctions from '../../common/ajax-functions'

class Search extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {location: undefined};

    this._changeLocation = this._changeLocation.bind(this);
    this._submitLocation = this._submitLocation.bind(this);
  }

  _changeLocation(){
    this.setState({location: this._location.value})
  }

  _submitLocation(e){
    e.preventDefault();
    this.props.submitLocation(this.state.location);
    this.setState({location:  undefined});
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

class Bar extends React.Component {
  _submitRsvp(){
    var appUrl = window.location.origin;
    var apiUrl = appUrl + '/api/rsvp/' + this.props.yelpId;
    var bars = this;

    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', apiUrl, function(data){
      console.log(JSON.parse(data));
    }));
  }

  render(){
    return(
      <li>
        <img src={this.props.img} className="img-responsive" alt={this.props.name}/>
        <p><a href={this.props.url}>{this.props.name}</a><Rsvp submitRsvp={this._submitRsvp.bind(this)} /><span className="attending">{this.props.attending} going</span></p>
        <p>"<em>{this.props.snippet}</em>"</p>
      </li>
    );
  }
}

class Rsvp extends React.Component {
  constructor(props) {
    super(props);
  
    this.handleClick = this._handleClick.bind(this);
  }

  _handleClick(){
    this.props.submitRsvp();
  }

  render(){
    return(
      <button onClick={this.handleClick} className="btn btn-primary rsvp-location ghost-button">I'm going!</button>
    );
  }
}

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {bars:[]};
  }

  _fetchBars(location){
    var appUrl = window.location.origin;
    var apiUrl = appUrl + '/api/nightlife/' + location;
    var bars = this;

    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data){
      let barData = JSON.parse(data)
      bars.setState({bars: barData.businesses});
    }));
  }

  _getBars(){
    let i = 0;
    return this.state.bars.map((bar)=> {
      i++;
      return <Bar
                yelpId={bar.id}
                name={bar.name}
                url={bar.mobile_url}
                img={bar.image_url}
                snippet={bar.snippet_text}
                attending={1}
                key={i}
              />
    });
  }

  render(){
    let bars;
    if(this.state.bars.length>0){
      bars = this._getBars();
    }

    return(
      <div className="container search-container">
        <h1>NightOff <i className="fa fa-beer" aria-hidden="true"></i> </h1>
        <p className="lead">Let your friends know where you'll be on your night off.</p>
        <Search submitLocation={this._fetchBars.bind(this)}/>
        <ul className="search-results">
          {bars}
        </ul>
      </div>
    );
  }
}
