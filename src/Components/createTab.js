import React from 'react';
import createTrack from './createTrack.js';

export default createTab;

const createTab = (update) => {
    const model = () => {
        return Object.assign({}, {});
    }

    const view = (model) => {
        return (
            <div>
                test
            </div>
        )
    }

    return {
        view,
        model
    }
}