import React from 'react';
import Header from './Header.js';
import PlaylistCreator from './PlaylistCreator.js';
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
                <Header />
                <PlaylistCreator />
            </div>
        )
    }
}