/*globals browser, console, SC, YT */
/*jslint plusplus: true */
var //playlistSC,
    playlistSY,
    playlistYT,
    redditSaved;

function newState() {
    'use strict';
    var i,
        possible,
        state;
    
    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    state = '';
    
    for (i = 0; i < 8; i++) {
        state += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    return state;
};

function generatePlaylistName() {
    'use strict';
    var date,
        dateRaw,
        input,
        name;
    
    input = document.getElementById('playlistNameInput').value;
    
    if (!!input) {
        name = input;
    } else {
        dateRaw = new Date();
        date = dateRaw.getFullYear(dateRaw) + '/' + (dateRaw.getMonth(dateRaw) + 1)  + '/' + dateRaw.getDate(dateRaw);
        name = 'PlaylistRx_' + date;
    }
    return name;
};

function toggleCheckedClass(event, id) {
    'use strict';
    var classes;
    
    classes = event?event.target.classList:id.classList;
    
    classes.contains('checked')?classes.remove('checked'):classes.add('checked');
}

function createRow(service, title, url, count) {
    'use strict';
    var checkbox,
        checkboxId,
        link,
        serviceClass,
        spotifyPlacer,
        td,
        tr,
        trId,
        youtubePlacer;
    
    spotifyPlacer = document.getElementById('youtubeSubheader').previousElementSibling;
    youtubePlacer = document.getElementById('playlistCreator').lastChild;
    
    tr = document.createElement('tr');
    
    switch (service) {
    case 'SY':
        trId = 'spotifyTrack' + count;
        checkboxId = 'spotifyCheck' + count;
        serviceClass = 'Spotify';
        spotifyPlacer.after(tr);
        break;
    case 'YT':
        trId = 'youtubeTrack' + count;
        checkboxId = 'youtubeCheck' + count;
        serviceClass = 'YouTube';
        youtubePlacer.after(tr);
        break;
    default:
        return;
    }
    
    tr.setAttribute('id', trId);
    
    checkbox = document.createElement('input');
    checkbox.setAttribute('id', checkboxId);
    checkbox.setAttribute('name', checkboxId);
    checkbox.setAttribute('type', 'checkbox');
    checkbox.classList.add(serviceClass, 'checked');
    checkbox.checked = true;
    checkbox.addEventListener('change', toggleCheckedClass);
    
    td = document.createElement('td');
    td.appendChild(checkbox);
    tr.appendChild(td);
    
    link = document.createElement('a');
    link.innerHTML = title;
    link.setAttribute('href', url);
    
    td = document.createElement('td');
    td.appendChild(link);
    td.setAttribute('colspan', '3');
    tr.appendChild(td);
};

function checkAll(event, service) {
    'use strict';
    var i,
        len,
        status,
        targets;
    
    i = 0;
    status = event.target.checked;
    
    switch (service) {
    case 'SY':
        targets = document.getElementsByClassName('Spotify');
        break;
    case 'YT':
        targets = document.getElementsByClassName('YouTube');
        break;
    default:
        targets = document.getElementsByTagName('input');
    }
    
    len = targets.length;
    
    for(i; i < len; i++) {
        if(targets[i].checked !== status) {
            targets[i].checked = status;
            toggleCheckedClass(null, targets[i]);
        }
    }
};

function serviceHasCheck(service) {
    'use strict';
    var i,
        len,
        nodes;
    
    i = 0;
    nodes = document.getElementsByClassName(service);
    len = nodes.length;
    
    for(i; i < len; i++) {
        if(nodes[i].checked === true) {
            return true;
        }
    }
}

playlistSY = {
    //vars
    albums: [],
    clientId: '5086ac5b03f84cfc9bf0d80792fe5264',
    clientSecret: 'a4db9422978c40ce9fc41f09cd1146ba',
    redirectURI: 'http://ext.local.playlistrx.com',
    playlistId: '',
    playlistName: '',
    songs: [],
    state: '',
    token: '',
    userId: '',
    
    //functions
    
    // Begin OAuth
    // Retrieve auth code
    authorize: function () {
        'use strict';
        var authURL,
            response;
        
        if (playlistSY.state === '') {
            playlistSY.state = newState();
        }
        
        authURL = 'https://accounts.spotify.com/authorize?response_type=token&scope=user-read-private%20playlist-modify-private%20playlist-modify-public&client_id=' + playlistSY.clientId + '&redirect_uri=' + playlistSY.redirectURI + '&state=' + playlistSY.state;
        
        return browser.identity.launchWebAuthFlow({
            interactive: true,
            url: authURL
        });
        
    },
    
    authTokenGet: function () {
        'use strict';
        return playlistSY.authorize().then(playlistSY.authValidate);
    },
    
    authValidate: function (URL) {
        'use strict';
        var syState;
        syState = URL.substring(330);
        if (playlistSY.state === syState) {
            playlistSY.token = URL.substring(46, 289);
            playlistSY.getUserId();
        }
    },
    // End OAuth
    addAlbumTracks: function () {
        'use strict';
        var i,
            len;
        
        len = playlistSY.albums.length;
    
        if (len !== 0) {
            for (i = 0; i < len; i++) {
                playlistSY.getAlbumTracks(playlistSY.albums[i].URL, playlistSY.albums[i].rId);
            }
        }
        playlistSY.addRows();
    },
    
    addRows: function () {
        'use strict';
        var i,
            len;
        
        i = 0;
        len = playlistSY.songs.length;
        
        for (i; i < len; i++) {
            createRow('SY', playlistSY.songs[i].title, playlistSY.songs[i].URL, i);
        }
    },
    
    getAlbumTracks: function (URL, rId) {
        'use strict';
        var albumId,
            i,
            len,
            response,
            title,
            xhr;
        
        albumId = URL.substring(31, 53);
        
        xhr = new XMLHttpRequest();
        xhr.open('get', 'https://api.spotify.com/v1/albums/' + albumId + '/tracks', false);
        xhr.setRequestHeader('Authorization', 'Bearer ' + playlistSY.token);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                response = JSON.parse(xhr.response);
                len = response.items.length;
                
                for (i = 0; i < len; i++) {
                    
                    title = response.items[i].artists[0].name + ' - ' + response.items[i].name;
                    
                    playlistSY.songs.push({
                        uri: response.items[i].uri,
                        rId: rId,
                        URL: 'https://open.spotify.com/track/' + response.items[i].id,
                        title: title
                    });
                }
            }
        };
        xhr.send();
    },
    
    getUserId: function () {
        'use strict';
        var response,
            xhr;
        
        xhr = new XMLHttpRequest();
        xhr.open('get', 'https://api.spotify.com/v1/me', true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + playlistSY.token);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                playlistSY.userId = JSON.parse(xhr.response).id;
                playlistSY.addAlbumTracks();
            }
        };
        xhr.send();
    },
    
    parseSYId: function (URL, rId, title) {
        'use strict';
        
        if (URL.substring(25, 30) === 'track') {
            playlistSY.songs.push({
                uri: 'spotify:track:' + URL.substring(31).split('?')[0],
                rId: rId,
                URL: URL,
                title: title
            });
        }
        
        if (URL.substring(25, 30) === 'album') {
            playlistSY.albums.push({
                rId: rId,
                URL: URL,
                title: title
            });
        }
        
    },
    
    playlistInstantiator: function () {
        'use strict';
        var params,
            response,
            xhr;
        
        playlistSY.playlistName = generatePlaylistName();
        
        xhr = new XMLHttpRequest();
        params = {
            name: playlistSY.playlistName
        };
        
        xhr.open('post', 'https://api.spotify.com/v1/users/' + playlistSY.userId + '/playlists', true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + playlistSY.token);
        xhr.setRequestHeader('content-type', 'application/json');
        // Listen for response
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 201) {
                playlistSY.playlistId = JSON.parse(xhr.response).id;
                playlistSY.saveTracks();
            }
        };
        xhr.send(JSON.stringify(params));
    },
    
    saveTracks: function (after) {
        'use strict';
        var i,
            len,
            params,
            uriArray,
            xhr;
        
        if (after) {
            i = after;
            if ((after + 100) > playlistSY.songs.length) {
                len = playlistSY.songs.length;
                after = false;
            } else {
                len = after + 100;
                after = len;
            }
        } else {
            i = 0;
            if (playlistSY.songs.length > 100 && after !== false) {
                len = 100;
                after = len;
            } else {
                len = playlistSY.songs.length;
            } 
        }
        
        uriArray = [];
        
        for (i; i < len; i++) {
            if(document.getElementById('spotifyCheck' + i).classList.contains('checked')) {
                uriArray.push(playlistSY.songs[i].uri);
            }
        }
        
        xhr = new XMLHttpRequest();
        params = {
            uris: uriArray
        };
        
        xhr.open('post', 'https://api.spotify.com/v1/users/' + playlistSY.userId + '/playlists/' + playlistSY.playlistId + '/tracks', true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + playlistSY.token);
        xhr.setRequestHeader('content-type', 'application/json');
        // Listen for response
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                playlistSY.saveTracks(after);
            }
        };
        xhr.send(JSON.stringify(params));
        
    },
};



playlistYT = {
    //vars
    clientId: '602382788924-lluqufsf5bldmu5ago6bt9vuojo48d1a.apps.googleusercontent.com',
    clientSecret: 'bzwcXuIiSfw4ctnHv7Lb1s-n',
    redirectURI: 'http://ext.local.playlistrx.com',
    playlistId: '',
    playlistName: '',
    songs: [],
    state: '',
    token: '',
    
    //functions
    
    // Begin OAuth
    // Retrieve auth code
    authorize: function () {
        'use strict';
        var authURL,
            response;
        
        if (playlistYT.state === '') {
            playlistYT.state = newState();
        }
        
        authURL = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + playlistYT.clientId + '&response_type=token&state=' + playlistYT.state + '&redirect_uri=' + playlistYT.redirectURI + '&scope=https://www.googleapis.com/auth/youtube';
        
        return browser.identity.launchWebAuthFlow({
            interactive: true,
            url: authURL
        });
    },
    
    authTokenGet: function () {
        'use strict';
        return playlistYT.authorize().then(playlistYT.authValidate);
    },
    
    // Retrieve accessToken
    authTokenVal: function () {
        'use strict';
        var response,
            xhr;
        
        xhr = new XMLHttpRequest();
        
        xhr.open('post', 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + playlistYT.token, true);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        // Listen for response
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                playlistYT.addRows();
            }
        };
        xhr.send();
    },
    
    authValidate: function (URL) {
        'use strict';
        var ytState;
        ytState = URL.substring(39, 47);
        if (playlistYT.state === ytState) {
            playlistYT.token = URL.substring(61, 193);
            playlistYT.authTokenVal();
        }
    },
    // End OAuth
    
    addRows: function () {
        'use strict';
        var i,
            len;
        
        i = 0;
        len = playlistYT.songs.length;
        
        for (i; i < len; i++) {
            createRow('YT', playlistYT.songs[i].title, playlistYT.songs[i].URL, i);
        }
    },
    
    parseYTId: function (URL, rId, title) {
        'use strict';
        var idMatcher,
            ytId;
        
        idMatcher = new RegExp(/[a-z,\d,\_,\-]{11}/, 'i');
        ytId = URL.match(idMatcher)[0];
        
        playlistYT.songs.push({
            ytId: ytId,
            rId: rId,
            URL: URL,
            title: title
        });
    },
    
    playlistInstantiator: function () {
        'use strict';
        var params,
            response,
            xhr;
        
        playlistYT.playlistName = generatePlaylistName();
        
        xhr = new XMLHttpRequest();
        params = {
            snippet: {
                title: playlistYT.playlistName
            }
        };
        
        xhr.open('post', 'https://www.googleapis.com/youtube/v3/playlists?access_token=' + playlistYT.token + '&part=snippet', true);
        xhr.setRequestHeader('content-type', 'application/json');
        
        // Listen for response
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                playlistYT.playlistId = JSON.parse(xhr.response).id;
                playlistYT.saveTracks();
            }
        };
        xhr.send(JSON.stringify(params));
    },
    
    saveTracks: function () {
        'use strict';
        var i,
            len,
            params,
            rId,
            target,
            URL,
            videoId,
            xhr;
        
        i = 0;
        len = playlistYT.songs.length;
        
        for(i; i < len; i++) {
            if(document.getElementById('youtubeCheck' + i).classList.contains('checked')) {
                xhr = new XMLHttpRequest();
                rId = playlistYT.songs[i].rId;
                URL = playlistYT.songs[i].URL;
                videoId = playlistYT.songs[i].ytId;

                params = {
                    snippet: {
                        playlistId: playlistYT.playlistId,
                        resourceId: {
                            kind: 'youtube#video',
                            videoId: videoId
                        }
                    }
                };

                xhr.open('post', 'https://www.googleapis.com/youtube/v3/playlistItems?access_token=' + playlistYT.token + '&part=snippet', false);
                xhr.setRequestHeader('content-type', 'application/json');

                // Listen for response
                xhr.onreadystatechange = function () {
                    if (this.status === 404) {
                        target = document.getElementById('youtubeTrack' + i).childNodes[1];
                        target.innerHTML += ' - Video Not Found';
                        target.classList.add('red');
                    }
                };
                xhr.send(JSON.stringify(params));
            }
        }      
    },
};

// redditSaved contains all variables and functions used to import youtube links from a reddit user's saved list
redditSaved = {
    // vars
    redirectURI: 'http://ext.local.playlistrx.com',
    state: '',
    token: '',
    
    // functions
    // Begin OAuth Authorization
    // Retrieve auth code
    authorize: function () {
        'use strict';
        var authURL,
            response;
        
        if (redditSaved.state === '') {
            redditSaved.state = newState();
        }
        
        authURL = 'https://www.reddit.com/api/v1/authorize?client_id=TmUL_dFTX39XPA&response_type=code&state=' + redditSaved.state + '&redirect_uri=' + redditSaved.redirectURI + '&duration=temporary&scope=history,identity,save';
        
        return browser.identity.launchWebAuthFlow({
            interactive: true,
            url: authURL
        });
    },
    authTokenGet: function () {
        'use strict';
        return redditSaved.authorize().then(redditSaved.authValidate);
    },
    
    // Retrieve accessToken
    authTokenVal: function (authCode) {
        'use strict';
        var params,
            response,
            xhr;
        
        xhr = new XMLHttpRequest();
        params = 'grant_type=authorization_code&code=' + authCode + '&redirect_uri=' + redditSaved.redirectURI;
        
        xhr.open('post', 'https://www.reddit.com/api/v1/access_token', true);
        // VG1VTF9kRlRYMzlYUEE6 is the base64 encoded app ID, e.g. "TmUL_dFTX39XPA:"
        xhr.setRequestHeader('Authorization', 'Basic VG1VTF9kRlRYMzlYUEE6');
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        // Listen for response
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                response = JSON.parse(xhr.response);
                redditSaved.token = response.access_token;
                redditSaved.retrieveUsername();
            }
        };
        xhr.send(params);
    },
    
    authValidate: function (URL) {
        'use strict';
        var rState;
        rState = URL.substring(39, 47);
        if (redditSaved.state === rState) {
            redditSaved.authTokenVal(URL.substring(53));
        }
    },
    // End OAuth
    
    retrieveUsername: function (n) {
        'use strict';
        var response,
            xhr;
        
        xhr = new XMLHttpRequest();
        xhr.open('get', 'https://oauth.reddit.com/api/v1/me', true);
        xhr.setRequestHeader('Authorization', 'bearer ' + redditSaved.token);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                redditSaved.retrieveSaved(JSON.parse(xhr.response).name);
            }
        };
        xhr.send();
    },
    
    retrieveSaved: function (username, after) {
        'use strict';
        var count,
            i,
            params,
            response,
            spotify,
            xhr,
            youtube;
        
        spotify = document.getElementById('checkSpotify').checked;
        youtube = document.getElementById('checkYouTube').checked;
        
        xhr = new XMLHttpRequest();
        params = '?limit=100';
        
        if(after) {
            params = params + '&after=' + after;
        }
        
        xhr.open('get', 'https://oauth.reddit.com/user/' + username + '/saved' + params, true);
        xhr.setRequestHeader('Authorization', 'bearer ' + redditSaved.token);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        // Listen for response
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                response = JSON.parse(xhr.response);
                count = response.data.children.length;
                after = response.data.after;
                for (i = 0; i < count; i++) {
                    if (spotify && response.data.children[i].data.domain === 'open.spotify.com') {
                        
                        if(!!response.data.children[i].data.media) {
                            playlistSY.parseSYId(response.data.children[i].data.url, response.data.children[i].data.name, response.data.children[i].data.media.oembed.description);
                        } else {
                            playlistSY.parseSYId(response.data.children[i].data.url, response.data.children[i].data.name, response.data.children[i].data.title);
                        }
                    }
                    
                    if (youtube && (response.data.children[i].data.domain === 'youtube.com' || response.data.children[i].data.domain === 'youtu.be')) {
                        
                        if(!!response.data.children[i].data.media) {
                            playlistYT.parseYTId(response.data.children[i].data.url, response.data.children[i].data.name, response.data.children[i].data.media.oembed.title);
                        } else {
                            playlistYT.parseYTId(response.data.children[i].data.url, response.data.children[i].data.name, response.data.children[i].data.title);
                        }
                    }
                    /*
                    if (response.data.children[i].data.domain === 'soundcloud.com') {
                        parseSCTitle(response.data.children[i].data.url, response.data.children[i].data.name);
                    }
                    */
                }
                after?redditSaved.retrieveSaved(username, after):tableBuilder();
            }
            
        };
        xhr.send(params);
    },
    
    unsave: function (rId) {
        'use strict';
        var params,
            xhr;
        
        params = 'id=' + rId;
        xhr = new XMLHttpRequest();
        xhr.open('post', 'https://oauth.reddit.com/api/unsave', false);
        xhr.setRequestHeader('Authorization', 'bearer ' + redditSaved.token);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        // Listen for response
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                
            }
        };
        xhr.send(params);
    },
    
    unsaveSelected: function () {
        'use strict';
        var checked,
            i,
            num;

        checked = document.getElementsByClassName('checked');
        i = checked.length - 1;
        
        for(i; i >= 0; i--) {
            if(checked[i].classList.contains('Spotify')) {
                num = parseInt(checked[i].id.substring(12), 10);
                redditSaved.unsave(playlistSY.songs[num].rId);
                //Must be placed in both to avoid affecting higher level checkboxes, e.g. Check All
                checked[i].parentNode.parentNode.parentNode.removeChild(checked[i].parentNode.parentNode);
            }
            
            if(checked[i].classList.contains('YouTube')) {
                num = parseInt(checked[i].id.substring(12), 10);
                redditSaved.unsave(playlistYT.songs[num].rId);
                //Must be placed in both to avoid affecting higher level checkboxes, e.g. Check All
                checked[i].parentNode.parentNode.parentNode.removeChild(checked[i].parentNode.parentNode);
            }
        }
    }
};

function confirmUnsaved() {
    'use strict';
    if(window.confirm('Remove these songs from PlaylistRx and your Reddit Saved list?')) {
        redditSaved.unsaveSelected();
    }
}

function tableBuilder() {
    'use strict';
    
    if (playlistYT.songs.length !== 0) {
        playlistYT.authTokenGet();
    }
    
    
    if (playlistSY.songs.length !== 0 || playlistSY.albums.length !== 0) {
        playlistSY.authTokenGet();
    }             

    /*
    if (playlistSC.songs.length !== 0) {
        playlistSC.authTokenGet();
    }
    */
};

function savePlaylists () {
    'use strict';
    
    if(serviceHasCheck('Spotify')) {
        playlistSY.playlistInstantiator();
    }
    
    if(serviceHasCheck('YouTube')) {
        playlistYT.playlistInstantiator();
    }
};

function clearPlaylistRx() {
    'use strict';
    var checked,
        i;
    
    playlistSY.songs = [];
    playlistYT.songs = [];

    checked = document.getElementsByClassName('checked');
    i = checked.length - 1;

    for(i; i >= 0; i--) {
        if(checked[i].classList.contains('Spotify') || checked[i].classList.contains('YouTube')) {
            checked[i].parentNode.parentNode.parentNode.removeChild(checked[i].parentNode.parentNode);
        }

    }
};

function getRedditSaved () {
    'use strict';
    clearPlaylistRx();
    redditSaved.authTokenGet();
};


document.getElementById('playlistRx').addEventListener('click', getRedditSaved);
document.getElementById('saveSelected').addEventListener('click', savePlaylists);
document.getElementById('unsaveSelected').addEventListener('click', confirmUnsaved);

document.getElementById('checkAll').addEventListener('change', function(event) {
    checkAll(event);
});
document.getElementById('spotifyCheckAll').addEventListener('change', function(event) {
    checkAll(event, 'SY');
});
document.getElementById('youtubeCheckAll').addEventListener('change', function(event) {
    checkAll(event, 'YT');
});