const _ = require('underscore');
const Bourne = require('bourne');

class Rater {
  constructor(engine, kind) {
    this.engine = engine;
    this.kind = kind;
    this.db = new Bourne(`./db-${kind}.json`);
  }

  add(user, item, done){
    return this.db.find({ user: user, item: item }, (err, res) => {
      if (err) {
        return done(err);
      }

      if (res.length > 0) {
        return done();
      }

      return this.db.insert({ user: user, item: item }, (err) => {
        if (err) {
          return done(err);
        }

        this.engine.similars.update(user, done);
        this.engine.suggestions.update(user, done);

        return done();
      })
    })

  }

  remove(user, item, done){

  }

  itemsByUser(user, done){

  }

  usersByItem(item, done){

  }

}
