
"use strict";

function Track (data) {
    if(data) { this._load(data); }
}

Track.prototype = new Model();
Track.fromURI = Model.fromURI;

Track.prototype._load = function (data) {
    
    Model.cache[data.href] = data;
    
    this.name = data.name;
    this.album = data.album;
    this.artists = data.artists;
    
    this.uri = data.href;
    
    this.playable = !!data.available;
    this.duration = data.length * 1E3;
    
    this.popularity = parseFloat(data.popularity);
    this.number = parseInt(data['track-number'], 10);
    
    this.image = "img/track.png";
    this.loaded = false;
    
    this.starred = Spotify.getInstance().starred(this.uri);
    
};

Track.prototype.album = null;
Track.prototype.artists = null;
Track.prototype.duration = null;
Track.prototype.image = null;
Track.prototype.loaded = false;
Track.prototype.name = null;
Track.prototype.number = null;
Track.prototype.playable = null;
Track.prototype.popularity = null;
Track.prototype.starred = null;
Track.prototype.uri = null;

Track.prototype.toString = function () {
    return '<track "' + this.name + '">';
};
