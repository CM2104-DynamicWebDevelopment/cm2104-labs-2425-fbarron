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

app.get("/", function (req, res) {
  res.send("Hello World! By Express");
});

// route for love in tracks, artists and albums
app.get("/searchLove", function (req, res) {
  getTracks("love", res);
});

// route for searching in tracks, artists and albums
app.get("/search", function (req, res) {
  var searchterm = req.query.searchterm;
  getTracks(searchterm, res);
});

// route for artists top tracks
app.get("/topTracks/:artistID", function (req, res) {
  var artistID = req.params.artistID;
  getTopTracks(artistID, res);
});

async function getTracks(searchterm, res) {
    spotifyApi.searchTracks(searchterm).then(
      function (data) {
        var tracks = data.body.tracks.items;
        var HTMLResponse = "<h1>Search Results</h1>";
  
        for (var i = 0; i < tracks.length; i++) {
          var track = tracks[i];
          var artistID = track.artists[0].id;
  
          HTMLResponse +=
            "<div>" +
            "<h2>" + track.name + "</h2>" +
            "<h4>" + track.artists[0].name + "</h4>" +
            "Artist ID: " + artistID + "<br>" +
            "<img src='" + track.album.images[0].url + "'>" +
            "<a href='" + track.external_urls.spotify + "'> Track Details </a><br>" +
            `<a href='/topTracks/${artistID}'> View Top Tracks </a><br>` + // Link to top tracks
            `<a href='/relatedArtists/${artistID}'> View Related Artists </a>` + // New link
            "</div>";
        }
  
        res.send("You searched for " + searchterm + "<br>" + HTMLResponse);
      },
      function (err) {
        console.error(err);
      }
    );
  }
  
  

async function getTopTracks(artistID, res) {
  spotifyApi.getArtistTopTracks(artistID, "GB").then(
    function (data) {
      console.log(data.body);
      var tracks = data.body.tracks;
      var HTMLResponse = "";

      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        console.log(track.name);
        HTMLResponse +=
          "<div>" +
          "<h2>" +
          track.name +
          "</h2>" +
          "<h4>" +
          track.artists[0].name +
          "</h4>" +
          "Artist ID: " +
          track.artists[0].id +
          "<br>" +
          "<img src='" +
          track.album.images[0].url +
          "'>" +
          "<a href='" +
          track.external_urls.spotify +
          "'> Track Details </a>" +
          "</div>";
      }

      // Send the response to the client
      res.send("Top Tracks:<br>" + HTMLResponse);
    },
    function (err) {
      console.log("Something went wrong!", err);
      res.status(500).send("Error retrieving top tracks");
    }
  );
}

async function getRelated(artistID, res) {
  spotifyApi.getArtistRelatedArtists(artistID).then(
    function (data) {
      console.log(data.body);
      var artists = data.body.artists;
      var HTMLResponse = "";
      for (var i = 0; i < artists.length; i++) {
        var artist = artists[i];
        console.log(artist.name);
        HTMLResponse +=
          "<div>" +
          "<h2>" +
          artist.name +
          "</h2>" +
          "<img src='" +
          artist.images[0].url +
          "'>" +
          "<a href='" +
          artist.external_urls.spotify +
          "'> Artist Details </a>" +
          "</div>";
      }
      // Send the response to the client
      res.send("Related Artists:<br>" + HTMLResponse);
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
}

// route for artists related artists
app.get("/relatedArtists/:artistID", function (req, res) {
  var artistID = req.params.artistID;
  getRelated(artistID, res);
});

app.listen(8080);
