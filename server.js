const _ = require('underscore');
const Bourne = require('bourne');
const express = require('express');

const movies = require('./data/movies.json');
const {Engine} = require('./lib/engine/engine.js');

const app = express();

const e = new Engine;
//
// const {Rater} = require('./lib/engine/rater.js');
// var rater = new Rater('engine', 'similars');

// rater.add('mo', 'abc');
// rater.remove('mo', 'abc');

//
// var app = express();
// 12
// 13	app.set('views', path.join(__dirname, 'views'));
// 14	app.engine('html', require('hogan-express'));
// 15	app.set('view engine', 'html');
// 16
// 17	app.use(express.static(path.join(__dirname, 'public')));
