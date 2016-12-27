const {Rater} = require('./rater.js');
const {Similars} = require './similars'
const {Suggestions} = require './suggestions'

class Engine {
  constructor() {
    this.likes = new Rater(this, 'likes');
    this.dislikes = new Rater(this, 'dislikes');
    this.similars = new Similars(this);
    this.suggestions = new Suggestions(this);
  }
}

module.exports = {
  Engine,
}
