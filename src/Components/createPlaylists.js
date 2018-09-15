import React from 'react';
import nest from '../utilities/nest.js';
import createTab from './createTab.js';

export default createPlaylists;

const createPlaylists = (update) => {
    const SpotifyTab = nest(createTab, update, "SpotifyTab"),
        YouTubeTab = nest(createTab, update, "YouTubeTab");

    const model = () => {
        return Object.assign({}, {
            spotify: SpotifyTab.model(),
            youtube: YouTubeTab.model()
        });
    }

    const view = (model) => {
        return (
            <div className='tabs'>
                <div>
                    <div id='spotifyTabSelector' className='tabSelector'>
                        Spotify
                    </div>
                    <div id='youTubeTabSelector' className='tabSelector'>
                        YouTube
                    </div>
                </div>
                {SpotifyTab.view(model)}
                {YouTubeTab.view(model)}
            </div>)
    }

    return {
        view,
        model
    }
}

// export default (props) => {
//     return (
//         <div className='tabs'>
//             <div>
//                 <div id='spotifyTabSelector' className='tabSelector'>
//                     Spotify
//                 </div>
//                 <div id='youTubeTabSelector' className='tabSelector'>
//                     YouTube
//                 </div>
//             </div>
//             {/* <SpotifyTracks />
//             <YouTubeTracks /> */}
//         </div>
//     )
// }
