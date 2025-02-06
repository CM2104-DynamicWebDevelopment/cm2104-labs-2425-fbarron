var express = require("express");
var app = express();
var SpotifyWebApi = require("spotify-web-api-node");
app.use(express.static("public"));

var spotifyApi = new SpotifyWebApi({
  clientId: "7ca02bc758b44ed18a28c5ae66a904c3",
  clientSecret: "6c26613d5b3346a18c3adf21fae5e4bf",
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant().then(
  function (data) {
    console.log("The access token expires in " + data.body["expires_in"]);
    console.log("The access token is " + data.body["access_token"]);

    // save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body["access_token"]);
  },

  function (err) {
    console.log(
      "Something went wrong when retrieving an access token",
      err.message
    );
  }
);

async function getTracks(searchterm, res) {
  spotifyApi.searchTracks(searchterm).then(
    function (data) {
        var tracks = data.body.tracks.items
        //lets set up a empty string to act as the response
        var HTMLResponse = "";
        //now lets run through all the items
        //this is a for loop
        for(var i=0; i<tracks.length;i++){
        var track = tracks[i];
        console.log(track.name);
        HTMLResponse = HTMLResponse +
        "<div>" +
        "<h2>"+track.name+"</h2>"+
        "<h4>"+track.artists[0].name+"</h4>"+
        "<img src='"+track.album.images[0].url +"'>"+
        "<a href='"+track.external_urls.spotify+"'> Track Details </a>"+
        "</div>";
        console.log(HTMLResponse);
        }
        res.send(HTMLResponse)
    },
    function (err) {
      console.error(err);
    }
  );
}


app.get("/", function (req, res) {
  res.send("Hello World! By Express");
});

// route for love in tracks, artists and albums
app.get("/searchLove", function (req, res) {
    getTracks("love", res);
  });

app.listen(8080);
