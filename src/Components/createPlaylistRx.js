import React from 'react';
import nest from '../utilities/nest.js';
import createToolbar from './createToolbar.js';
import PlaylistTabs from './PlaylistTabs.js';

const PlaylistRx = (update) => {
    const toolbar = nest(createToolbar, update, "Toolbar");

    const model = () => {
        return Object.assign({}, toolbar.model());
    };

    const view = (model) => {
            return(
            <div>
            <div>
                <h1 className="headlvine">Playlist<span className="headlineRx">Rx</span></h1>
            </div>
           {toolbar.view(model)}
            {/*<PlaylistTabs /> */}
            </div >
        )
    };

return { model, view }
}

export default PlaylistRx;