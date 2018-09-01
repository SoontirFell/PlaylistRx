import React from 'react';

export default class Toolbar extends React.Component {
    render() {
        return (
            <div>
                <input id="checkAll" type="checkbox" name="checkAll" checked />
                <label id="playlistName">
                    <input id="playlistNameInput" type="text" name="playlistName" placeholder="Enter Playlist Name" class="" />
                </label>
                <div id="saveSelected" class="smallButton">
                    Save
                </div>
                <div id="unsaveSelected" class="smallButton">
                    Unsave
                </div>
            </div>
        )
    }
}