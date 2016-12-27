const _ = require('underscore');
const Bourne = require('bourne');

class Similars {
  constructor(engine) {
    this.engine = engine;
    this.db = new Bourne(`./db-similars.json`);
  }

  byUser(user, done){
    this.db.findOne({user:user}, (err, {others}) => {
      if (err) {
        return done(err);
      }
      return done(null, others);
    })
  }

  update(user, done){
    const userLikes = (done) => {
      return this.engine.likes.itemsByUser(user, done);
    };

    const userDislikes = () => {
      return this.engine.dislikes.itemsByUser(user, done);
    }

    // after getting

    const items = _.flatten([userLikes, userDislikes]);

    // console.log(items);
    var prefArray = [this.engine.likes, this.engine.dislikes];

    var others = prefArray.map((item, done) => {
      rater.usersByItem(item, done);
    });

    others = _.without(_.unique(_.flatten(others)), user);

    others.forEach((other) => {
      var otherLikes = this.engine.likes.itemsByUser(other, done);
      var otherDislikes = this.engine.dislikes.itemsByUser(other, done);
      var similarity = (_.intersection(userLikes,   otherLikes).length + _.intersection(userDislikes, otherDislikes).length -_.intersection(userLikes, otherDislikes).length - _.intersection(userDislikes, otherLikes) / _.union(userLikes,otherLikes,userDislikes, otherDislikes).length);
      this.db.insert({other, similarity}, done);

    });

  }
}

module.exports = {
  Similars
}
