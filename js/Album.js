
"use strict";

function Album (data) {
    if(data) { this._load(data); }
}

Album.prototype = new Model();
Album.fromURI = Model.fromURI;

Album.prototype._load = function (data) {
    
    var a, i;
    
    this.artist = {
        name: data.artist,
        href: data['artist-id']
    };
    
    this.playable = !!data.available;
    this.cover = "img/album.png";
    this.length = data.tracks.length;
    this.name = data.name;
    this.tracks = [];
    this.uri = data.href;
    this.year = parseInt(data.released);
    
    a = {
        released: data.released,
        href: data.href,
        name: data.name
    };
    
    for(i=0; i<this.length; i++) {
        data.tracks[i].album = a;
        this.tracks.push(new Track(data.tracks[i]));
    }
    
};

Album.prototype.artist = null;
Album.prototype.cover = null;
Album.prototype.length = null;
Album.prototype.name = null;
Album.prototype.playable = null;
Album.prototype.tracks = null;
Album.prototype.uri = null;
Album.prototype.year = null;

Album.prototype.get = function (idx) {
    return this.tracks[idx];
};

Album.prototype.toString = function () {
    return '<album "' + this.name + '">';
};
