import React from 'react';
import ajaxFunctions from '../../common/ajax-functions';

class Search extends React.Component {
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

class Bar extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {rsvp: this.props.userGoing, attending: this.props.attending};
  }

  _AuthenticateTwitter(){
    window.location = '/auth/twitter'
  }

  _submitRsvp(){
    var appUrl = window.location.origin;
    var apiUrl = appUrl + '/api/rsvp/' + this.props.yelpId;
    var bar = this;
    if(this.props.user){
      if(this.state.rsvp){
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('PUT', apiUrl, function(data){
          bar.setState({rsvp: false, attending: bar.props.attending - 1});
        }));
      } else{
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', apiUrl, function(data){
          bar.setState({rsvp: true, attending: bar.props.attending + 1});
        }));
      }
    } else{
      this._AuthenticateTwitter();
    }
  }

  render(){
    var attending = 0;

    if(this.state.rsvp){
      attending = 1;
    }

    return(
      <li>
        <img src={this.props.img} className="img-responsive" alt={this.props.name}/>
        <p><a href={this.props.url} target="_blank">{this.props.name}</a><Rsvp attending={this.state.rsvp} submitRsvp={this._submitRsvp.bind(this)} /><span className="attending">{this.state.attending} going</span></p>
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
    let status;

    if(this.props.attending){
      status = "I'm not going"
    } else{
      status = "I'm going";
    }

    return(
      <button onClick={this.handleClick} className="btn rsvp-location ghost-button">{status}</button>
    );
  }
}

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {bars:[], user: undefined};
  }

  componentWillMount() {
    this._fetchUserData();
    this._locateStoredLocation();
  }

  _locateStoredLocation(){
    const location = localStorage.getItem('_bar_location');

    if(location !== null){
      this._fetchBars(location);
    }
  }

  _saveLocation(location){
    localStorage.setItem('_bar_location', location);
  }

  _fetchBars(location){
    var appUrl = window.location.origin;
    var apiUrl = appUrl + '/api/nightlife/' + location;
    var bars = this;
    this._saveLocation(location);

    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data){
      let barData = JSON.parse(data)
      bars.setState({bars: barData, user: bars.state.user});
    }));
  }

  _fetchUserData(){
    var appUrl = window.location.origin;
    var apiUrl = appUrl + '/api/user/:id';
    var bars = this;

    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data){
      let userObject = JSON.parse(data);
      bars.setState({bars: bars.state.bars, user: userObject});
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
                attending={bar.attending}
                user={this.state.user}
                userGoing={bar.userGoing}
                key={bar.id}
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
