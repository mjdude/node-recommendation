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

    var prefArray = [this.engine.likes, this.engine.dislikes];

    const allUsers = prefArray.map((item, done) => {
      rater.usersByItem(item, done);
    });

  }
}
