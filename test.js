const _ = require('underscore');
const Bourne = require('bourne');
const express = require('express');

const movies = require('./data/movies.json');
const {Engine} = require('./lib/engine/engine.js');

const e = new Engine;


e.suggestions.forUser('ho').then((suggestions) => {
  console.log('result is ', suggestions);
  suggestions = _.map(_.sortBy(suggestions,(suggestion) => {
    return -suggestion.weight;
  }), (suggestion)  => {
      return _.findWhere(movies, {
      id: suggestion.item
    });
  })

  console.log('new suggestions is', suggestions);
})
