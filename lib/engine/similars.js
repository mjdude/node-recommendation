const _ = require('underscore');
const Bourne = require('bourne');

class Similars {
  constructor(engine) {
    this.db = new Bourne(`./db-similars.json`);
  }

  byUser(user, done){

  }
}
