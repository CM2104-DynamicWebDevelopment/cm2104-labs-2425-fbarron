const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(express.static("public"));

// Initialise Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: "7ca02bc758b44ed18a28c5ae66a904c3",
  clientSecret: "6c26613d5b3346a18c3adf21fae5e4bf",
});

// Retrieve and set access token
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    console.log(`Access token expires in ${data.body["expires_in"]} seconds`);
    console.log(`Access token: ${data.body["access_token"]}`);
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((err) => console.error("Error retrieving access token:", err.message));

// Routes
app.get("/", (req, res) => res.send("Hello World! By Express"));

app.get("/searchLove", (req, res) => getTracks("love", res));

app.get("/search", (req, res) => {
  const searchterm = req.query.searchterm;
  getTracks(searchterm, res);
});

app.get("/topTracks/:artistID", (req, res) => {
  const artistID = req.params.artistID;
  getTopTracks(artistID, res);
});

app.get("/relatedArtists/:artistID", (req, res) => {
  const artistID = req.params.artistID;
  getRelatedArtists(artistID, res);
});

// Functions
async function getTracks(searchterm, res) {
  try {
    const data = await spotifyApi.searchTracks(searchterm);
    const tracks = data.body.tracks.items;
    
    let HTMLResponse = `<h1>Search Results for "${searchterm}"</h1>`;
    
    tracks.forEach(track => {
      const artistID = track.artists[0].id;
      const imageUrl = track.album.images[0]?.url || "https://via.placeholder.com/150";
      
      HTMLResponse += `
        <div>
          <h2>${track.name}</h2>
          <h4>${track.artists[0].name}</h4>
          <img src="${imageUrl}" alt="Album cover">
          <a href="${track.external_urls.spotify}">Track Details</a><br>
          <a href="/topTracks/${artistID}">View Top Tracks</a><br>
          <a href="/relatedArtists/${artistID}">View Related Artists</a>
        </div>
      `;
    });

    res.send(HTMLResponse);
  } catch (err) {
    console.error("Error searching tracks:", err);
    res.status(500).send("Error retrieving tracks");
  }
}

async function getTopTracks(artistID, res) {
  try {
    const data = await spotifyApi.getArtistTopTracks(artistID, "GB");
    const tracks = data.body.tracks;
    
    let HTMLResponse = `<h1>Top Tracks</h1>`;
    
    tracks.forEach(track => {
      const imageUrl = track.album.images[0]?.url || "https://via.placeholder.com/150";
      HTMLResponse += `
        <div>
          <h2>${track.name}</h2>
          <h4>${track.artists[0].name}</h4>
          <img src="${imageUrl}" alt="Album cover">
          <a href="${track.external_urls.spotify}">Track Details</a>
        </div>
      `;
    });

    res.send(HTMLResponse);
  } catch (err) {
    console.error("Error retrieving top tracks:", err);
    res.status(500).send("Error retrieving top tracks");
  }
}

async function getRelatedArtists(artistID, res) {
  try {
    const data = await spotifyApi.getArtistRelatedArtists(artistID);
    const artists = data.body.artists;
    
    if (!artists.length) return res.send("<h1>No related artists found</h1>");
    
    let HTMLResponse = `<h1>Related Artists</h1>`;
    
    artists.forEach(artist => {
      const imageUrl = artist.images[0]?.url || "https://via.placeholder.com/150";
      HTMLResponse += `
        <div>
          <h2>${artist.name}</h2>
          <img src="${imageUrl}" alt="Artist image">
          <a href="${artist.external_urls.spotify}">Artist Details</a>
        </div>
      `;
    });

    res.send(HTMLResponse);
  } catch (err) {
    console.error("Error retrieving related artists:", err);
    res.status(500).send("Error retrieving related artists");
  }
}

// Start server
const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));