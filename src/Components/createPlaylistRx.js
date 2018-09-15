import React from 'react';
import nest from '../utilities/nest.js';
import createToolbar from './createToolbar.js';
import createPlaylists from './createPlaylists.js';

export default PlaylistRx;

const PlaylistRx = (update) => {
    const Toolbar = nest(createToolbar, update, "Toolbar"),
        Playlists = nest(createPlaylists, update, "Playlists");

    const model = () => {
        return Object.assign({}, Toolbar.model(), Playlists.model());
    };

    const view = (model) => {
        return (
            <div>
                <div>
                    <h1 className="headlvine shadowOutline">Playlist<span className="headlineRx">Rx</span></h1>
                </div>
                {Toolbar.view(model)}
                {Playlists.view(model)}
            </div >
        )
    };

    return { model, view }
};