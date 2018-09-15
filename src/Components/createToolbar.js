import React from 'react';

export default createToolbar;

const createToolbar = (update) => {
    const toggleCheck = (event) => {
        return update((model) => {
            const map = {
                spotifyCheck: 'isSpotifyChecked',
                youTubeCheck: 'isYouTubeChecked'
            },
                key = map[event.target.id];

            model[key] = !(model[key]);
            return model;
        })
    }

    const model = () => {
        return Object.assign({}, {
            isSpotifyChecked: true,
            isYouTubeChecked: true
        });
    }

    const view = (model) => {
        return (
            <div>
                <div>
                    <p className="largeLabel">Create Playlists For: </p>
                    <label for-="spotifyCheck">
                        Spotify
                        <input id="spotifyCheck" name="spotifyCheck" type="checkbox" checked={model.isSpotifyChecked} onClick={toggleCheck} />
                    </label>
                    <label for-="youTubeCheck">
                        YouTube
                        <input id="youTubeCheck" name="youTubeCheck" type="checkbox" checked={model.isYouTubeChecked} onClick={toggleCheck} />
                    </label>
                </div>
                <div>
                    <div id="redditScanButton" className="button" >
                        Scan Reddit Saved
                    </div>
                </div>
                <div>
                    <input id='playlistGivenName' name='playlistGivenName' type='text' placeholder='Name your playlist(s)' />
                    <div id="playlistRx" className="button" >
                        Create Playlist(s)
                    </div>
                    <div id="redditUnsaveButton" className="button marginLeft" >
                        Remove from Reddit Saved
                    </div>
                </div>
            </div>
        )
    }

    return {
        view,
        model
    }
}