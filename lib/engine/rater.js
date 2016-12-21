const _ = require('underscore');
const Bourne = require('bourne');

class Rater {
  constructor(engine, kind) {
    var @db = new Bourne(`./db-${kind}.json`);
  }

  add(user, item, done){

  }

  remove(user, item, done){

  }

  itemsByUser(user, done){

  }

  usersByItem(item, done){
    
  }

}
