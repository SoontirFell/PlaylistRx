import React from 'react';

export default (props) => {
    return (
        <div>
            <div>
                <h3>Create Playlists For: </h3>
                <input id="checkSpotify" name="checkSpotify" type="checkbox" checked />>
                <input id="checkYouTube" name="checkYouTube" type="checkbox" checked />
            </div>
            <div>
                <div id="playlistRx" class="button" name="playlistRx" >
                    Scan Reddit Saved
                    </div>
                <div id="playlistRx" class="button" name="playlistRx" >
                    Remove from Reddit Saved
                </div>
            </div>
            <div>
                <input id='playlistsGivenName' type='text' placeholder='Name your playlist(s)' />
                <div id="playlistRx" class="button" name="playlistRx" >
                    Create Playlist(s)
                </div>
            </div>
            <div>
                <div id='spotifyTabSelector' className='tabSelector'>
                    Spotify
                </div>
                <div id='YouTubeTabSelector' className='tabSelector'>
                    YouTube
                </div>
            </div>
        </div>
    )
}