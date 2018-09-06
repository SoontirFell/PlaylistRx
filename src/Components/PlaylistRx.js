import React from 'react';
import Toolbar from './Toolbar.js';
import PlaylistTabs from './PlaylistTabs.js';

const PlaylistRx = (update) => {
    const model = () => {

    };

    let view = (model) => {
            return(
            <div>
            <div>
                <h1 className="headline">Playlist<span className="headlineRx">Rx</span></h1>
            </div>
            {/* <Toolbar />
            <PlaylistTabs /> */}
            </div >
        )
    };

return { model, view}
}

export default PlaylistRx;