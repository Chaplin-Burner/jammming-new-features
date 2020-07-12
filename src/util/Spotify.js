const clientId = '760c94802c784a838e120edddf550ab0';
const redirectUri = 'http://localhost:3000/';
let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        // Check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //this clears the parameters, allowing us to grabb a new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }

    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
            {
                headers:
                    { Authorization: `Bearer ${accessToken}` }
            }
        ).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                preview: track.preview_url,
            }));
        });
    },
    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
          return;
        }
    
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;
    
        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        ).then(jsonResponse => {
          userId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({name: name})
          }).then(response => response.json()
          ).then(jsonResponse => {
            const playlistId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({uris: trackUris})
            });
          });
        });
      }
};

export default Spotify;















































/* const client_id = '760c94802c784a838e120edddf550ab0';
//const response_type = 'token';
const redirect_uri = 'http://localhost:3000/';
const url = 'GET https://api.spotify.com/v1/search?type=track&q='
let accessToken;

const Spotify = {

    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        // check for an access token match
        const accessTokenMatch = window.location.href.match(/access_token([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // this clears the parameters, allowing us to grab a new access
            // token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
            window.location = accessUrl;
        }

    },

    async search(term) {
        const accessToken = Spotify.getAccessToken();
        try {
            const response = await fetch(url + term, {
                Headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                let jsonResponse = await response.json();
                if (!jsonResponse.tracks) {
                    return [];
                } else {
                    const getData = jsonResponse.tracks.items.map(track => ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri,
                    }));
                    return getData;
                }
            } throw new Error('Request failed!');
        } catch (error) {
            console.log(error);
        };
    },

        async savePlaylist(playlistName, trackUris) {
            if (!playlistName || !trackUris.length) {
                return;
            }
            const accessToken = Spotify.getAccessToken;
            const headers = { Authorization: `Bearer ${accessToken}` };
            let userId;
            let playlistId;
            try {
                const response = await fetch('https://api.spotify.com/v1/me', {
                    headers: headers
                });
                if (response.ok) {
                    const jsonResponse = await response.json();
                    return userId = jsonResponse.id;
                } throw new Error('Request failed!');
            } catch (error) {
                console.log(error);
            }
            try {
                const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name: playlistName })
                });
                if (response.ok) {
                    const jsonResponse = await response.json();
                    const playlistId = jsonResponse.id;
                    return playlistId;
                } throw new Error('Request failed!');

            } catch (error) {
                console.log(error);
            }
            try {
                cosnt response = await fetch(`/v1/playlists/{playlist_id}/tracks`)

            }catch (error) {
                console.log(error);
            }

        }


}

export default Spotify; */
