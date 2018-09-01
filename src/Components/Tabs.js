import React from 'react';
import SpotifyTracks from './SpotifyTracks.js';
import YouTubeTracks from './YouTubeTracks.js';

export default class Toolbar extends React.Component {
    render() {
        return (
            <div>
                <SpotifyTracks />
                <YouTubeTracks />
            </div>
        )
    }
}