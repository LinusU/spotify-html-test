
"use strict";

function Spotify () {
    
    var that = this;
    
    this.uri = "";
    this.queue = new PlayQueue();
    
    setTimeout(function () {
        that._load(location.hash || "#spotify:welcome");
    }, 1);
    
    window.addEventListener("hashchange", function () {
        that._load(window.location.hash);
    }, false);
    
}

Spotify._instance = null;

Spotify.getInstance = function () {
    return Spotify._instance || (Spotify._instance = new Spotify());
}

Spotify.prototype._load = function (uri) {
    
    var parts = uri.substring(1).split(':');
    var $main = $('div[role="main"]');
    
    var cb = function (html) {
        $main.append(html).removeClass('loading');
    };
    
    $main.empty().addClass('loading');
    
    this.uri = uri.substring(1);
    
    switch(parts[1]) {
        case 'artist': return Spotify.Views.Artist(this, this.uri, cb);
        case 'album': return Spotify.Views.Album(this, this.uri, cb);
        case 'track': return Spotify.Views.Track(this, this.uri, cb);
        case 'playlist': return Spotify.Views.Playlist(this, this.uri, cb);
        case 'starred': return Spotify.Views.Starred(this, this.uri, cb);
        case 'welcome': return Spotify.Views.Welcome(this, this.uri, cb);
        case 'search': return Spotify.Views.Search(this, this.uri, cb);
        case 'playqueue': return Spotify.Views.PlayQueue(this, this.uri, cb);
    }
    
    $main.removeClass('loading');
    
    return false;
}

Spotify.prototype.starred = function (uri, value) {
    
    var list = JSON.parse(localStorage.getItem('starred') || "[]");
    var idx = list.indexOf(uri);
    
    if(arguments.length > 1) {
        if(value && idx == -1) { list.push(uri); }
        if(!value && idx != -1) { list.splice(idx, 1); }
        localStorage.setItem('starred', JSON.stringify(list));
    }
    
    return (idx != -1);
}

Spotify.prototype.reload = function (uri) {
    this._load("#" + this.uri);
}

Spotify.prototype.ajax = function (uri, cb) {
    
    var url = (function (uri) {
        
        var parts = uri.split(':');
        
        if(parts.length < 2) { return uri; }
        
        switch(parts[1]) {
            case 'artist': return "http://ws.spotify.com/lookup/1/.json?extras=album&uri=" + encodeURIComponent(uri);
            case 'album': return "http://ws.spotify.com/lookup/1/.json?extras=trackdetail&uri=" + encodeURIComponent(uri);
            case 'track': return "http://ws.spotify.com/lookup/1/.json?uri=" + encodeURIComponent(uri);
            case 'search':
                switch(parts[2]) {
                    case 'artist': return "http://ws.spotify.com/search/1/artist.json?q=" + encodeURIComponent(parts[3]);
                    case 'album': return "http://ws.spotify.com/search/1/album.json?q=" + encodeURIComponent(parts[3]);
                    case 'track': return "http://ws.spotify.com/search/1/track.json?q=" + encodeURIComponent(parts[3]);
                    default: return "http://ws.spotify.com/search/1/track.json?q=" + encodeURIComponent(parts[2]);
                }
            default: return uri;
        }
        
    })(uri);
    
    return $.ajax({
        context: this,
        dataType: 'json',
        success: cb,
        url: url
    });
    
}
