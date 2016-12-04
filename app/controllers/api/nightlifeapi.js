var yelp = require('node-yelp');

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
}

module.exports = NightlifeApi;
