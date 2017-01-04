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
    let likes;
    let dislikes;
    let items =[];
    let unratedItems =[];
    let likers;
    let dislikers;
    let others;
    this.engine.similars.byUser(user)
    .then((otherUsers) => {
      others = otherUsers
      return Promise.all([
        this.engine.likes.itemsByUser(user),
        this.engine.dislikes.itemsByUser(user)
      ])
    })
    .then((userPref) => {
      this.db.delete({user});
      likes = userPref[0];
      dislikes = userPref[1];
      return new Promise((resolve, reject) => {
        others.forEach((other) => {
          Promise.all([
            this.engine.likes.itemsByUser(other.user),
            this.engine.dislikes.itemsByUser(other.user)
          ]).then((res) => {
            items.push(res);
          }).then((res) => {
            resolve(items);
          });
        });
      })
    })
    .then((items) => {
        unratedItems = _.difference(_.unique(_.flatten([items])), likes, dislikes);
        this.db.delete({user});
        unratedItems.forEach((item) => {
          Promise.all([
              this.engine.likes.usersByItem(item),
              this.engine.dislikes.usersByItem(item)
          ]).then((usersByItem) => {
            likers = usersByItem[0];
            dislikers = usersByItem[1];

                let numerator = 0;
                let ref = _.without(_.flatten([likers, dislikers]), user);
                for (let i = 0 ; i < ref.length; i++) {
                  let other = ref[i];
                  other = _.findWhere(others, {
                    user: other
                  });
                  if (other != null) {
                    numerator += other.similarity;
                  }
                }

                let weight = numerator / _.union(likers, dislikers).length;
                return {item,weight};
          }).then((suggestions) => {
            this.db.insert({user: user , suggestions: suggestions })
          });
        });
    })
  }
}

module.exports = {
  Suggestions,
}
