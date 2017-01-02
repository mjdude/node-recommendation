const _ = require('underscore');
const Bourne = require('bourne');

class Similars {
  constructor(engine) {
    this.engine = engine;
    this.db = new Bourne(`./db-similars.json`);
  }

  byUser(userName){
    console.log(userName);
  this.db.findOne( {user: userName}, (err, others) => {
      console.log(others);
      if (err) {
        return console.log(err);;
      }
      console.log('others is',others);
      return others;
    })
  }

  update(user){
    let userLikes;
    let userDislikes;
    let items;
    let otherLikes;
    let otherDislikes;

    Promise.all([
      this.engine.likes.itemsByUser(user),
      this.engine.dislikes.itemsByUser(user)
    ])
    .then((userPref) => {
      userLikes = userPref[0];
      userDislikes = userPref[1];

      items = _.flatten(userLikes, userDislikes);
      var raters = [this.engine.likes, this.engine.dislikes];
      var promiseArray = items.map((item) => {
        return raters.map((rater) => {
          return rater.usersByItem(item);
        });
    })
    return Promise.all(_.flatten(promiseArray));
  }).then((othersArray) => {
      var others = _.without(_.unique(_.flatten(othersArray)), user);
      others.forEach((other) => {
        Promise.all([this.engine.likes.itemsByUser(other),this.engine.dislikes.itemsByUser(other)])
          .then((otherPref) => {
            var otherLikes = otherPref[0];
            var otherDislikes = otherPref[1];
            var similarity = (_.intersection(userLikes, otherLikes).length + _.intersection(userDislikes, otherDislikes).length -_.intersection(userLikes, otherDislikes).length - _.intersection(userDislikes, otherLikes) / _.union(userLikes,otherLikes,userDislikes, otherDislikes).length);
            console.log('similarity is ', similarity);

            this.db.insert({user: other, similarity});
          })
      });
    });
  }

}

module.exports = {
  Similars
}
