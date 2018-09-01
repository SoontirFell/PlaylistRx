import React from 'react';
import Header from './Header.js';
import Playlist from './Playlist.js';

export default class PlaylistRx extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <Playlist />
            </div>
        )
    }
}