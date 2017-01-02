const _ = require('underscore');
const Bourne = require('bourne');

class Similars {
  constructor(engine) {
    this.engine = engine;
    this.db = new Bourne(`./db-similars.json`);
  }

  byUser(user){
    this.db.findOne( {user:user}, (err, others) => {
      if (err) {
        return console.log(err);;
      }
      console.log(user);
      console.log(others);
      return others;
    })
  }

  update(user){
    const userLikes = () => {
      return this.engine.likes.itemsByUser(user);
    };

    const userDislikes = () => {
      return this.engine.dislikes.itemsByUser(user);
    }

    console.log(user);
    console.log(this.engine.likes.itemsByUser(user));

    // after getting

    const items = _.flatten([userLikes, userDislikes]);

    // console.log(items);
    var raters = [this.engine.likes, this.engine.dislikes];

    var others = items.map((item) => {
      return raters.map((rater) => {
        rater.usersByItem(item);
      });
    })


    others = _.without(_.unique(_.flatten(others)), user);

    others.forEach((other) => {
      var otherLikes = this.engine.likes.itemsByUser(other);
      var otherDislikes = this.engine.dislikes.itemsByUser(other);
      var similarity = (_.intersection(userLikes,   otherLikes).length + _.intersection(userDislikes, otherDislikes).length -_.intersection(userLikes, otherDislikes).length - _.intersection(userDislikes, otherLikes) / _.union(userLikes,otherLikes,userDislikes, otherDislikes).length);
      this.db.insert({other, similarity});

    });

  }
}

module.exports = {
  Similars
}
