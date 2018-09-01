import React from 'react';
import Header from './Header.js';
import PlaylistCreator from './PlaylistCreator.js';

export default class PlaylistRx extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <PlaylistCreator />
            </div>
        )
    }
}