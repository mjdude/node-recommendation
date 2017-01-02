const _ = require('underscore');
const Bourne = require('bourne');

class Similars {
  constructor(engine) {
    this.engine = engine;
    this.db = new Bourne(`./db-similars.json`);
  }

  byUser(user){
    return new Promise((resolve, reject) => {
      this.db.findOne( {user}, (err, others) => {
        console.log('inside similar, others is ', others);
        if (err) {
          reject(err);
        }
        resolve(others);
      });
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
      // console.log('userPref for mo', userPref);


      items = _.flatten([userLikes, userDislikes]);
      // console.log('items for mo', items);
      var raters = [this.engine.likes, this.engine.dislikes];
      var promiseOthersArray = items.map((item) => {
        return raters.map((rater) => {
          return rater.usersByItem(item);
        });
    })
    return Promise.all(_.flatten(promiseOthersArray));
  }).then((othersArray) => {
      console.log('othersArray is ', othersArray);
      var others = _.without(_.unique(_.flatten(othersArray)), user);
      console.log('others is ', others);
      others.forEach((other) => {
        Promise.all([this.engine.likes.itemsByUser(other),this.engine.dislikes.itemsByUser(other)])
          .then((otherPref) => {
            console.log();
            let otherLikes = otherPref[0];
            let otherDislikes = otherPref[1];
            let similarity = (_.intersection(userLikes, otherLikes).length + _.intersection(userDislikes, otherDislikes).length -_.intersection(userLikes, otherDislikes).length - _.intersection(userDislikes, otherLikes) / _.union(userLikes,otherLikes,userDislikes, otherDislikes).length);
            let otherSimilarity = {other, similarity}
            this.db.insert({user, similarity: otherSimilarity});
          })
      });
    });
  }

}

module.exports = {
  Similars
}
