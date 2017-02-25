import React from 'react';
import ajaxFunctions from '../common/ajax-functions';
import Bar from './bar.jsx';
import Search from './search.jsx';

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