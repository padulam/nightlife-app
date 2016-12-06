module.exports = function(app, passport){
  var path = require('path');
  var dir = process.cwd();
  var bodyParser = require('body-parser');
  var NightlifeApi = require('../controllers/api/nightlifeapi');

  var jsonParser = bodyParser.json();
  var urlencodedParser = bodyParser.urlencoded({ extended: false });

  var nightlifeApi = new NightlifeApi();

  app.get('/', function(request, response){
    response.sendFile(path.resolve(dir, 'public', 'index.html'));
  });

  app.route('/logout')
    .get(function(request, response){
      request.logout();
      response.redirect('/');
  });

  app.route('/api/user/:id')
    .get(function(request, response){
      response.json(request.user||null);
    });

  app.route('/api/nightlife/:location')
    .get(nightlifeApi.getLocations);

  app.route('/api/rsvp/:yelp_id')
    .post(nightlifeApi.rsvpToLocation);

  app.route('/auth/twitter')
    .get(passport.authenticate('twitter'));

  app.route('/auth/twitter/callback')
    .get(passport.authenticate('twitter', {
      successRedirect: '/polls',
      failureRedirect: '/',
      failureFlash: true
    }));
};