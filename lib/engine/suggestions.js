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
      var items = [this.engine.likes, this.engine.dislikes].map((rater, done) => {
        rater.itemsByUser(other.user, done);
      });

      items = _.difference(_.unique(_.flatten(items), likes, dislikes));
      this.db.delete({user:user}, (err) => {
        const other = items.map((item, done) => {
            const likers = this.engine.likes.usersByItem(item);
            const dislikers = this.engine.dislikes.usersByItem(item);

            return [likers, dislikers];
        });

        numerator = 0;
        ref = _.without(_.flatten([likers, dislikers]), user);
        for (i = 0 ; i < ref.length; i++) {
          other = ref[i];
          other = _.findWhere(others, {
            user: other
          });
          if (other != null) {
            numerator += other.similarity;
          }
        }


        return done( null, {
          item: item,
          weight: numerator / _.union(likers, dislikers).length
        })



      })

      this.db.insert({
        user:user,
        suggestions: suggestions
      })
    })
  }
}

module.exports = {
  Suggestions,
}
