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

        Rsvp.find(function(err, rsvps){
          var businessData = data.businesses.map(function(business){
            var going = 0;
            var userGoing = false;

            if(err) response.json({err: err});
            
            function findBusiness(b){
              return b.yelp_id === business.id;
            }

            function findUser(u){
              return u===request.user.twitter.username;
            }

            var rsvpData = rsvps.find(findBusiness);

            if(rsvpData){
              going = rsvpData.going.length;
              if(rsvpData.going.find(findUser)){
                userGoing = true;
              }
            }

            return {id: business.id,
                    name: business.name,
                    mobile_url: business.mobile_url,
                    image_url: business.image_url,
                    snippet_text: business.snippet_text,
                    attending: going,
                    userGoing: userGoing};
          });

          response.json(businessData);
        });
    });
  }

  this.rsvpToLocation = function(request, response){
    Rsvp.findOne({yelp_id: request.params.yelp_id}, function(err, rsvp){
      if(err) response.json({err: err});

      if(rsvp){
        rsvp.going.push(request.user.twitter.username);
        rsvp.save(function(err){
          if(err) response.json({err: err});

          response.json({going: rsvp.going.length});
        });
      }else{
        var newRsvp = new Rsvp();
        newRsvp.going.push(request.user.twitter.username);
        newRsvp.yelp_id = request.params.yelp_id;

        newRsvp.save(function(err){
          if(err) response.json({err: err});

          response.json({going: 1}); 
        });
      } 
    });
  }
}

module.exports = NightlifeApi;
