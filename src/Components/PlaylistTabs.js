import React from 'react';
import SpotifyTracks from './SpotifyTracks.js';
import YouTubeTracks from './YouTubeTracks.js';

export default (props) => {
    return (
        <div className='tabs'>
            <div>
                <div id='spotifyTabSelector' className='tabSelector'>
                    Spotify
                </div>
                <div id='youTubeTabSelector' className='tabSelector'>
                    YouTube
                </div>
            </div>
            <SpotifyTracks />
            <YouTubeTracks />
        </div>
    )
}
