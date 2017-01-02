const _ = require('underscore');
const Bourne = require('bourne');

class Rater {
  constructor(engine, kind) {
    this.engine = engine;
    this.kind = kind;
    this.db = new Bourne(`./db-${kind}.json`);
  }

  add(user, item){
    this.db.find({ user: user, item: item }, (err, res) => {
      if (err) {
        return console.log(err);
      }

      if (res.length > 0) {
        return console.log('User found');
      }

      return this.db.insert({ user: user, item: item }, (err) => {
        if (err) {
          return console.log(err);
        }

        this.engine.similars.update(user);
        this.engine.suggestions.update(user);

        return console.log('Complete Added');
      })
    })

  }

  remove(user, item){
    return this.db.delete({ user: user, item: item }, (err) => {
      if (err) {
        return console.log(err);
      }

      this.engine.similars.update(user);
      this.engine.suggestions.update(user);

      return console.log('Complete remove');;
    })
  }

  itemsByUser(user){
    return new Promise((resolve, reject) => {
        this.db.find({user: user}, (err, ratings) => {
          if (err) {
            reject(err);
          }
          resolve(_.pluck(ratings, 'item'));
        });
    })
  }


  usersByItem(item){
    return new Promise((resolve, reject) => {
      this.db.find({item:item}, (err, ratings) => {
        if (err) {
          reject(err);
        }
        resolve(_.pluck(ratings, 'user'));
      })
    });
  }
}

module.exports = {
  Rater,
}
