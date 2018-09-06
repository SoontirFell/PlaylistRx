import React from 'react';

export default (props) => {
    const utilities = props.controllers.utilities,
        model = props.model;

    console.log(props);

    return (
        <div>
            <div>
                <h3>Create Playlists For: </h3>
                <input id="spotifyCheck" name="spotifyCheck" type="checkbox" checked={model.spotifyCheck.checked} onClick={utilities.toggleChecked(model.spotifyCheck)} />
                <input id="youTubeCheck" name="youTubeCheck" type="checkbox" checked={model.youTubeCheck.checked} onClick={utilities.toggleChecked(model.youTubeCheck)}  />
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