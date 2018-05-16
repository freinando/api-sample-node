var express = require('express'),
	bodyParser = require('body-parser'),
	_ = require('underscore'),
	json = require('./movies.json'),
	app = express(),
	request = require('request');


app.set('port', process.env.PORT || 3500);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var router = new express.Router();
router.get('/test', (req, res) =>{
	var data = {
		name: 'Jason Krol',
		website: 'http://kroltech.com'
	};
	res.json(data);
});

router.get('/', (req, res) => res.json(json));

router.post('/', (req, res)=> {
		// insert the new item into the collection (validate first)
		if(req.body.Id && req.body.Title && req.body.Director && req.body.Year && req.body.Rating) {
			json.push(req.body);
			res.json(json);
		} else {
			res.json(500, { error: 'There was an error!' });
		}
	}
);


router.put('/:id', (req, res) => {
	// update the item in the collection
	if(req.params.id && req.body.Title && req.body.Director && req.body.Year && req.body.Rating) {

		for(var movie of json){
			if (movie.Id === req.params.id) {
				movie.Title = req.body.Title;
				movie.Director = req.body.Director;
				movie.Year = req.body.Year;
				movie.Rating = req.body.Rating;
			}
		}

		res.json(json);
	} else {
		res.json(500, { error: 'There was an error!' });
	}
});


router.delete('/:id', (req, res) => {

	for(var i = 0; i < json.length; i++){
		if (json[i].Id === req.params.id) {
			json.splice(i, 1);
		}
	}
	res.json(json);
});


router.get('/external-api', async (req, res) =>{

	request({
		method: 'GET',
		uri: 'http://localhost:' + (process.env.PORT || 3500),
		}, (error, response, body) => {
			if (error) { throw error; }
			var movies = [];
			for(elem of JSON.parse(body)){
				movies.push({
					Title: elem.Title,
					Rating: elem.Rating
				});
			}
	});
	res.json(_.sortBy(movies, 'Rating').reverse());
});

app.use('/', router);

var server = app.listen(app.get('port'), function() {
	console.log('Server up: http://localhost:' + app.get('port'));
});