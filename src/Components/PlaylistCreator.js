import React from 'react';
import Toolbar from './Toolbar.js';
import Tabs from './Tabs.js';

export default class Playlist extends React.Component {
    render() {
        return (
            <div>
                <Toolbar />
                <Tabs />
            </div>
        )
    }
}