import React from 'react';

export default (props) => {
    return (
        <div id={props.id} className="playlistTrack">
            <input type="checkbox" checked id={`${props.id}Checkbox`} name={`${props.id}Checkbox`} className={props.service} />
            <a href={props.url} >{props.title}</a>
        </div>
    )
}