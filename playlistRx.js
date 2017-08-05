/*globals browser, console, SC, YT */
/*jslint plusplus: true */
var playlistSC,
    playlistSY,
    playlistYT,
    redditSaved;


var errorHandling = {
    
    errors: [],
    
    postErrors: function () {
        'use strict';
        var i,
            len;
        
        i = 0;
        len = errorHandling.errors.length;
        
        if (len !== 0) {
            for (i; i < len; i++) {
                console.log(errorHandling.errors[i]);
            }
        }
    }
};

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
}

function generatePlaylistName() {
    'use strict';
    var date,
        dateRaw;
    
    dateRaw = new Date();
    date = dateRaw.getFullYear(dateRaw) + '/' + dateRaw.getMonth(dateRaw)  + '/' + dateRaw.getDate(dateRaw);
    
    return 'PlaylistRx_' + date;
}

function parseSCTitle(URL, serviceType, rId) {
    'use strict';
    
    
}


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
        var xhr,
            params,
            response;
        
        xhr = new XMLHttpRequest();
        params = 'access_token=' + playlistYT.token;
        
        xhr.open('post', 'https://www.googleapis.com/oauth2/v3/tokeninfo', true);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        // Listen for response
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                playlistYT.playlistInstantiator();
            }
        };
        xhr.send(params);
    },
    
    authValidate: function (URL) {
        'use strict';
        var rState;
        rState = URL.substring(39, 47);
        if (playlistYT.state === rState) {
            playlistYT.token = URL.substring(61, 192);
            playlistYT.authTokenVal();
        }
    },
    // End OAuth
    
    parseYtId: function (URL, rId) {
        'use strict';
        var idMatcher,
            ytId;
        
        idMatcher = new RegExp(/[a-z,\d,\_,\-]{11}/, 'i');
        ytId = URL.match(idMatcher)[0];
        
        playlistYT.songs.push({
            ytId: ytId,
            rId: rId,
            URL: URL
        });
    },
    
    //finish
    playlistAdd: function () {
        'use strict';
        var len,
            params,
            rId,
            URL,
            videoId,
            xhr;
        
        if (playlistYT.songs.length === 0) {
            return;
        }
        
        rId = playlistYT.songs[0].rId;
        URL = playlistYT.songs[0].URL;
        videoId = playlistYT.songs[0].ytId;
        
        xhr = new XMLHttpRequest();
        params = {
            snippet: {
                playlistId: playlistYT.playlistId,
                resourceId: {
                    kind: 'youtube#video',
                    videoId: videoId
                }
            }
        };
        
        xhr.open('post', 'https://www.googleapis.com/youtube/v3/playlistItems?access_token=' + playlistYT.token + '&part=snippet', true);
        xhr.setRequestHeader('content-type', 'application/json');
        
        // Listen for response
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                //TODO Add success tracking
                playlistYT.songs.splice(0, 1);
                playlistYT.playlistAdd();
            }
            
            if (this.readyState === 4 && this.status === 404) {
                errorHandling.errors.push(rId + ' - ' + URL);
                playlistYT.songs.splice(0, 1);
                playlistYT.playlistAdd();
            }
        };
        xhr.send(JSON.stringify(params));
        
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
                playlistYT.playlistAdd();
            }
        };
        xhr.send(JSON.stringify(params));
    }
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
        var xhr,
            params,
            response;
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
        var xhr,
            response;
        
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
    
    retrieveSaved: function (username) {
        'use strict';
        var xhr,
            i,
            count,
            params,
            response;
        xhr = new XMLHttpRequest();
        params = '?limit=100';
        xhr.open('get', 'https://oauth.reddit.com/user/' + username + '/saved' + params, true);
        xhr.setRequestHeader('Authorization', 'bearer ' + redditSaved.token);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        // Listen for response
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                response = JSON.parse(xhr.response);
                count = response.data.children.length;
                for (i = 0; i < count; i++) {
                    if (response.data.children[i].data.domain === 'youtube.com' || response.data.children[i].data.domain === 'youtu.be') {
                        playlistYT.parseYtId(response.data.children[i].data.url, response.data.children[i].data.name);
                    }
                    /*
                    if (response.data.children[i].data.domain === 'soundcloud.com') {
                        parseSCTitle(response.data.children[i].data.url, response.data.children[i].data.name);
                    }
                    */
                }

                if (playlistYT.songs.length !== 0) {
                    playlistYT.authTokenGet();
                }
                
                /*
                if (playlistSC.songs.length !== 0) {
                    playlistSC.authTokenGet();
                }
                
                if (playlistSY.songs.length !== 0) {
                    playlistSY.authTokenGet();
                }
                */
            }
            
        };
        xhr.send(params);
    },
    
    unsave: function (num) {
        'use strict';
        var xhr,
            params;
        xhr = new XMLHttpRequest();
        //params = 'id=' + playlist.songs[num].rId;
        xhr.open('post', 'https://oauth.reddit.com/api/unsave', true);
        xhr.setRequestHeader('Authorization', 'bearer ' + redditSaved.token);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        // Listen for response
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                //playlist.removeSong(num);
            }
        };
        xhr.send(params);
    }
    
};

// Create and modify the playlist object which contains all songs, the song index, and playlist functions


document.getElementById('playlistRx').addEventListener('click', redditSaved.authTokenGet);
//document.getElementById('unsave').addEventListener('click', placeholder);