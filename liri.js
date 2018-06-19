require("dotenv").config();

var fs = require('fs');
var Twitter = require('twitter');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var request = require("request");

 console.log(process.argv); 

var inputs = process.argv[2];


if (inputs === "my-tweets") {
    mytweets();
}
else if (inputs === "spotify-this-song") {
    spotifythissong();
}
else if (inputs === "movie-this") {
    moviethis(process.argv[3]);
}
else if (inputs === "do-what-it-says") {
    dowhatitsays();
}




function mytweets() {
    var params = {
        screen_name: '@bellbottom5', 
        count: 20
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
             //console.log(tweets);
            for (var i = 0; i < tweets.length; i++) {
                console.log("Tweet number " + [i] + " : " + tweets[i].text);
                console.log("This was tweeted on: " + tweets[i].created_at);
                console.log("===============================");
            };
        }
        else {
            console.log(error);
        }
    });
};

function spotifythissong(songName) {

    var songName = process.argv[3];
    if (!songName) {
        songName = "The Sign, Ace of Base";
    }


    spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        console.log(data.tracks.items[0].album.name); 
        console.log(data.tracks.items[0].artists[0].name);
        console.log(data.tracks.items[0].name);
        console.log(data.tracks.items[0].preview_url);   
    });

    

};

function moviethis(movie) {

    //var movie = process.argv[3];

        if (!movie) {
            movie = 'Mr. Nobody';
        }


    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

        //pull requested data into readable format
        var movieData = JSON.parse(body);
        //var request = 
            console.log("Title: " + movieData.Title);
            console.log("Year: " + movieData.Year);
            console.log("IMDB Rating: " + movieData.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + movieData.Ratings[1].Value);
            console.log("Origin Country: " + movieData.Country);
            console.log("Language: " + movieData.Language);
            console.log("Plot: " + movieData.Plot);
            console.log("Actors: " + movieData.Actors);

           // console.log(request);
           //console.log(movieData);


  }
  

});


};


function dowhatitsays() {

    fs.readFile("random.txt", "utf8", function(error, data) {
        if(error){
            console.log(error);
            
        }else {

        // Split the text into a command type and input
        var dataArr = data.split(",")
        var userCommand = dataArr[0];
        var secondCommand = dataArr[1];

        
        if (userCommand === "my-tweets") {
            mytweets();
        }
        else if (userCommand === "spotify-this-song") {
            spotifythissong(secondCommand);
        }
        else if (userCommand === "movie-this") {
            moviethis(secondCommand);
        }
        
        console.log("dowhatitsays")
    
            
    };

});

};
