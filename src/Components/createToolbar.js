import React from 'react';

const createToolbar = (update) => {
    const toggleCheck = (event) => {
        return update( (model) => {
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
                    <h3>Create Playlists For: </h3>
                    <label for-="spotifyCheck">
                        Spotify
                        <input id="spotifyCheck" name="spotifyCheck" type="checkbox" checked={model.isSpotifyChecked} onClick={toggleCheck}/>
                    </label>
                    <label for-="youTubeCheck">
                        YouTube
                        <input id="youTubeCheck" name="youTubeCheck" type="checkbox" checked={model.isYouTubeChecked} onClick={toggleCheck} />
                    </label>
                </div>
                <div>
                    <div id="redditScanButton" class="button" >
                        Scan Reddit Saved
                    </div>
                    <div id="redditUnsaveButton" class="button" >
                        Remove from Reddit Saved
                    </div>
                </div>
                <div>
                    <input id='playlistGivenName' name='playlistGivenName' type='text' placeholder='Name your playlist(s)' />
                    <div id="playlistRx" class="button" >
                        Create Playlist(s)
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

export default createToolbar;