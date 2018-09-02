import React from 'react';
import Toolbar from './Toolbar.js';
import TabView from './TabView.js';
import initialState from '../initialState.js';

export default class PlaylistRx extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    render() {
        return (
            <div>
                <div>
                    <h1 className="headline">Playlist<span className="headlineRx">Rx</span></h1>
                </div>
                <Toolbar />
                <TabView />
            </div>
        )
    }
}