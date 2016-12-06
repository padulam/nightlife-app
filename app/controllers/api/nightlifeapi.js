var yelp = require('node-yelp');
var Rsvp = require('../../models/rsvps');

function NightlifeApi(){
  this.getLocations = function(request, response){
    var client = yelp.createClient({
      oauth: {
        "consumer_key": process.env.YELP_CONSUMER_KEY,
        "consumer_secret": process.env.YELP_CONSUMER_SECRET,
        "token": process.env.YELP_TOKEN,
        "token_secret": process.env.YELP_TOKEN_SECRET
      }
    });

    client.search({
      terms: "bars",
      location: request.params.location,
      category_filter: "bars"
    }).then(function(data){
      response.json(data);
    });
  }

  this.rsvpToLocation = function(request, response){
    Rsvp.findOne({yelp_id: request.params.yelp_id}, function(err, rsvp){
      if(err) response.json({err: err});

      if(rsvp){
        rsvp.going.push(request.user.twitter.username);
        rsvp.save(function(err){
          if(err) response.json({err: err});

          response.json({success: 'RSVP added!'});
        });
      }else{
        var newRsvp = new Rsvp();
        newRsvp.going.push(request.user.twitter.username);
        newRsvp.yelp_id = request.params.yelp_id;

        newRsvp.save(function(err){
          if(err) response.json({err: err});

          response.json({success: 'RSVP added!'}); 
        });
      } 
    });
  }
}

module.exports = NightlifeApi;
