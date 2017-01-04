const _ = require('underscore');
const Bourne = require('bourne');
const express = require('express');

const movies = require('./data/movies.json');
const {Engine} = require('./lib/engine/engine.js');

const e = new Engine;
const PORT = process.env.PORT || 3000;
const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.route('/refresh').post(({query}, res, next) => {
  console.log('calling refresh');

  e.similars.update(query.user)
  .then(() => {
    e.suggestions.update(query.user)
    res.redirect(`/?user=${query.user}`);
  });

});

app.route('/like').post(({query}, res, next) => {
  if (query.unset === 'yes') {
    e.likes.remove(query.user, query.movie)
    .then(() => {
      res.redirect(`/?user=${query.user}`);
    });
  } else {
    e.dislikes.remove(query.user, query.movie)
    e.likes.add(query.user, query.movie);
    res.redirect(`/?user=${query.user}`);
  }
})

app.route('dislike').post(({query}, res, next) => {
  if (query.unset === 'yes') {
    e.dislikes.remove(query.user, query.movie)
    .then(() => {
      res.redirect(`/?user=${query.user}`);
    });
  } else {
    e.likes.remove(query.user, query.movie)
    e.dislikes.add(query.user, query.movie);
    res.redirect(`/?user=${query.user}`);
  }
})


app.route('/').get(({query}, res, next) => {
  let likes, dislikes, suggestions;
  console.log(`Calling main route with query ${query}`);
  Promise.all([
    e.likes.itemsByUser(query.user),
    e.dislikes.itemsByUser(query.user),
  ]).then((raterResults) => {
    likes= raterResults[0];
    dislikes = raterResults[1];

    suggestions = e.suggestions.forUser(query.user);
    suggestions = _.map(_.sortBy(suggestions, function(suggestion) {
      return -suggestion.weight;
    }), function(suggestion) {
      return _.findWhere(movies, {
        id: suggestion.item
      });
    })
    console.log(`likes, dislikes, suggestions ${likes} ${dislikes} ${suggestions.slice(0,4)}`);
  }).then(() => {
      res.render('index',
      {
        movies: movies,
        user: query.user,
        likes: likes,
        dislikes: dislikes,
        suggestions: suggestions.slice(0, 4),
    }
  );
  })
})

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});


// // e.likes.add('mo', 'Transformers: Age of Extinction');
// e.likes.add('mo', "5");
// e.likes.add('mo', "4");
// e.likes.add('mo', "3");
// e.likes.add('mo', "1");
// e.likes.add('mo', "2");
// e.dislikes.add('mo', "7");
// e.likes.add('jo', "5");
// e.likes.add('jo', "4");
// e.likes.add('jo', "3");
// e.likes.add('ho', "1");
// e.likes.add('ho', "2");
// e.dislikes.add('jo', "7");
// e.likes.add('jo', "2");
// e.likes.add('mo', "1");

// e.similars.update('mo');
// e.suggestions.forUser('mo');
// e.similars.byUser('jo').then((res) => {
//   console.log(res);
// });
// e.suggestions.update('ho');


 // console.log(e.similars.byUser('jo'));
// e.likes.add('jo', 'Transformers: Age of Extinction');
// e.likes.add('jo', 'Guardians of the Galaxy');

// e.likes.add('hilda', 'Transformers: Age of Extinction');

// e.likes.remove('mo', 'Transformers: Age of Extinction');

// e.likes.itemsByUser('jo').then((res) => {
//   // console.log(res);
// });

 // e.dislikes.itemsByUser("mo").then(res => console.log(res));

// e.dislikes.usersByItem("7").then(res => console.log(res));

// e.similars.update('mo');
// console.log(e.similars.byUser('jo'));

// e.similars.update('jo');
// e.dislikes.add('jo', 'Batman v Superman');
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
