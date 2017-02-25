import React from 'react';
import ajaxFunctions from '../common/ajax-functions';
import Rsvp from './rsvp.jsx';

export default class Bar extends React.Component {
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
          let barData = JSON.parse(data);
          bar.setState({rsvp: false, attending: barData.going});
        }));
      } else{
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', apiUrl, function(data){
          let barData = JSON.parse(data);
          bar.setState({rsvp: true, attending: barData.going});
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