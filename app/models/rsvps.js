var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Rsvp = new Schema({
  yelp_id: String,
  going: Array
});

module.exports = mongoose.model('Rsvp', Rsvp);