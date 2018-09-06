import React from 'react';
import ReactDOM from 'react-dom';
import flyd from 'flyd';
import nest from './utilities/nest.js';
import PlaylistRx from './Components/PlaylistRx.js';

const root = document.getElementById('root'),
    update = flyd.stream(),
    createPlaylistRx = (update) => nest(PlaylistRx, update, "PlaylistRx"),
    app = createPlaylistRx(update);

    const models = flyd.scan((model, func) => func(model), app.model(), update);

models.map( (model) => ReactDOM.render(app.view(model), root) );