import React from 'react';
import SpotifyTracks from './SpotifyTracks.js';
import YouTubeTracks from './YouTubeTracks.js';

export default (props) => {
    return (
        <div>
            <SpotifyTracks />
            <YouTubeTracks />
        </div>
    )
}
