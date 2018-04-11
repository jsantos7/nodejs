const sqlite = require('sqlite'),
      Sequelize = require('sequelize'),
      request = require('request'),
      express = require('express'),
      app = express();

const { PORT=3000, NODE_ENV='development', DB_PATH='./db/database.db' } = process.env;

// START SERVER
Promise.resolve()
  .then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch((err) => { if (NODE_ENV === 'development') console.error(err.stack); });

// ROUTES
app.get('/films/:id/recommendations', getFilmRecommendations);
app.get('/films/:id/recommendations?offset=:offset&limit:limit', pagination);
app.get('/films/:id/recommendations?offset=:offset', pagination);
app.get('/films/:id/recommendations?limit:limit', pagination);
app.get('*', errorPage);

// ROUTE HANDLER
function getFilmRecommendations(req, res) {
  	// to do
   // var releaseRange = [];
   // Film.findAll({
   //    where: {
   //    	releaseDate: {$between:[]}
   //    }
   // });


    Film.findAll(({
	  where: {
	  	genre_id: req.params.id[genre_id],
	    film_id: req.params.id,
	    releaseDate: {$between:[,]} // Been released within 15 years, before or after the parent film
	    averageRating: {$gt: 4},
	    reviews: {$gte: 5},
	    order: [Film, 'film_id', 'DESC']
	  }
	}), function(err, recommendations){
       if(err){
           console.log(err);
           res.status(422).send("Invalid Id");
       } else {
           res.status(200).send(recommendations);
       }
   } );
  
}



// var url = "http://freshpotatoesapi.com?id=" + req.params.id;
  	// request(url, function(err, res, body){
  	//	if(!error && response.statusCode == 200) {
    //         var data = JSON.parse(body)
    //         res.render("recommendations", {data: data});
    //     }
  	// });

function pagination(req, res){

	Film.findAll(({
	  where: {
	  	genre_id: req.params.id[genre_id],
	    film_id: req.params.id,
	    releaseDate: {$between:[,]} // Been released within 15 years, before or after the parent film
	    averageRating: {$gt: 4},
	    reviews: {$gte: 5},
	    order: [Film, 'film_id', 'DESC']
	  }
	},
		{limit: req.params.limit},
		{offset: req.params.offset}


	), function(err, recommendations){
       if(err){
           console.log(err);
           res.status(422).send("Invalid value for limit and/or offset.");
       } else {
           res.status(200).send(recommendations);
       }
   } );

}

function errorPage(req, res){
	res.status(404).send("Page not found.");
}

module.exports = app;
