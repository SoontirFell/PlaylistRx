import React from 'react';

export default (props) => {
    return (
        <div>
            <div>
                <h3>Create Playlists For: </h3>
                <input id="spotifyCheck" name="spotifyCheck" type="checkbox" checked={false}/>
                <input id="youTubeCheck" name="youTubeCheck" type="checkbox" checked={true}/>
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
            <div>
                <div id='spotifyTabSelector' className='tabSelector'>
                    Spotify
                </div>
                <div id='youTubeTabSelector' className='tabSelector'>
                    YouTube
                </div>
            </div>
        </div>
    )
}