import React from 'react';
import Header from './Header.js';
import Toolbar from './Toolbar.js';
import TabView from './TabView.js';
import controllerMethods from '../controllerMethods.js'

export default class PlaylistRx extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            controllerMethods: controllerMethods
        };
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