const _ = require('underscore');
const Bourne = require('bourne');

class Suggestions {
  constructor(engine) {
    this.engine = engine;
    this.db = new Bourne(`./db-suggestions.json`);
  }

  forUser(user, done){
    this.db.findOne({user:user}, (err, {suggestions}={suggestion: []}) => {
      if (err) {
        return done(err);
      }
      return done(null, suggestions);
    });
  }

  update(user, done){
    this.engine.similars.byUser(user, (err, others) => {
      if (err) {
        return done(err);
      }

      const likes = this.engine.likes.itemsByUser(user, done);
      const dislikes = this.engine.dislikes.itemsByUser(user, done);
      const items = [this.engine.likes, this.engine.dislikes].map((rater, done) => {
        rater.itemsByUser(other.user, done);
      });


    })
  }
}

module.exports = {
  Suggestions,
}
