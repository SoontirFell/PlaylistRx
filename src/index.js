import React from 'react';
import ReactDOM from 'react-dom';
import flyd from 'flyd';
import nest from './utilities/nest.js';
import createPlaylistRx from './Components/createPlaylistRx.js';

const root = document.getElementById('root'),
    update = flyd.stream(),
    playlistRx = (update) => nest(createPlaylistRx, update, "PlaylistRx"),
    app = playlistRx(update);

    const models = flyd.scan((model, func) => func(model), app.model(), update);

models.map( (model) => ReactDOM.render(app.view(model), root) );