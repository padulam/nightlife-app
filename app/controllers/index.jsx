import React from 'react';
import {render} from 'react-dom';
import Home from './components/home.jsx';
import Layout from './components/layout.jsx';
import ajaxFunctions from '../common/ajax-functions';
import {browserHistory, Router, Route, Redirect, IndexRoute} from 'react-router';

function authenticate(nextState, replace) {
  var appUrl = window.location.origin;
  var apiUrl = appUrl + '/api/user/:id';

  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data){
    var userObject = JSON.parse(data);
    if(!userObject){
      browserHistory.push('/');
    }
  }));
}

const app = (
  <Router history={browserHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Home} />
    </Route>
  </Router>
);

render(app, document.getElementById('nightlife-app'));