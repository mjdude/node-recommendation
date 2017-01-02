const _ = require('underscore');
const Bourne = require('bourne');

class Suggestions {
  constructor(engine) {
    this.engine = engine;
    this.db = new Bourne(`./db-suggestions.json`);
  }

  forUser(user){
    this.db.findOne({user:user}, (err, suggestions={suggestion: []}) => {
      if (err) {
        return console.log(err);
      }
      console.log(suggestions);
      return suggestions;
    });
  }

  update(user){
    // this.engine.similars.byUser(user, (err, others) => {
    //   if (err) {
    //     return console.log(err);;
    //   }
    //
    //   const likes = this.engine.likes.itemsByUser(user);
    //   const dislikes = this.engine.dislikes.itemsByUser(user);
    //   var items = [this.engine.likes, this.engine.dislikes].map((rater) => {
    //     rater.itemsByUser(other.user);
    //   });
    //
    //   items = _.difference(_.unique(_.flatten(items), likes, dislikes));
    //   this.db.delete({user:user}, (err) => {
    //     const other = items.map((item) => {
    //         const likers = this.engine.likes.usersByItem(item);
    //         const dislikers = this.engine.dislikes.usersByItem(item);
    //
    //         return [likers, dislikers];
    //     });
    //
    //     numerator = 0;
    //     ref = _.without(_.flatten([likers, dislikers]), user);
    //     for (i = 0 ; i < ref.length; i++) {
    //       other = ref[i];
    //       other = _.findWhere(others, {
    //         user: other
    //       });
    //       if (other != null) {
    //         numerator += other.similarity;
    //       }
    //     }
    //
    //
    //     return {
    //       item: item,
    //       weight: numerator / _.union(likers, dislikers).length
    //     }
    //
    //   })
    //
    //   this.db.insert({
    //     user:user,
    //     suggestions: suggestions
    //   })
    // })
    let likes;
    let dislikes;
    let items;
    let likers;
    let dislikers;
    let others;
    this.engine.similars.byUser(user)
    .then((otherUsers) => {
      others = otherUsers
      console.log('inside suggestions, others is ', others);
      // Promise.all([
      //   this.engine.likes.usersByItem(item),
      //   this.engine.dislikes.usersByItem(item)
      // ])
      return Promise.all([
        this.engine.likes.itemsByUser(user),
        this.engine.dislikes.itemsByUser(user)
      ])
    })
    .then((userPref) => {
      this.db.delete({user});
      likes = userPref[0];
      dislikes = userPref[1];
      console.log('User prefs are ', userPref);

      // now get items from other usersByItem

      console.log('Others are ', others);
      // items = _.flatten(userPref);
      // items = _.difference(_.unique(_.flatten(items), likes, dislikes));
      // console.log('items user has not rated', items);
      // return Promise.all([
      //   this.engine.likes.usersByItem(item),
      //   this.engine.dislikes.usersByItem(item)
      // ])
    })
  }
}

module.exports = {
  Suggestions,
}
