
"use strict";

function Playlist (id) {
    
    if(!id) {
        id = (new Date()).getTime();
        this.load(id);
        this._title = "New playlist";
    } else {
        this.load(id);
    }
    
}

Playlist.create = function (title) {
    
    var id = (new Date()).getTime();
    var pls = Playlist.list();
    
    pls.push({
        id: id,
        title: title,
        tracks: []
    });
    
    localStorage.setItem('playlists', JSON.stringify(pls));
    
    return new Playlist(id);
};

Playlist.remove = function (id) {
    
    var i;
    var idx = null;
    var pls = Playlist.list();
    
    for(i=0; i<pls.length; i++) {
        if(pls[i].id == id) {
            idx = i;
        }
    }
    
    if(i === null) { return ; }
    
    pls.splice(idx, 1);
    
    localStorage.setItem('playlists', JSON.stringify(pls));
    
    return ;
};

Playlist.list = function () {
    return JSON.parse(localStorage.getItem('playlists') || "[]");
};

Playlist.prototype.load = function (id) {
    
    var i;
    var pls = Playlist.list();
    
    for(i=0; i<pls.length; i++) {
        if(pls[i].id == id) {
            this._id = id;
            this._title = pls[i].title;
            this._tracks = pls[i].tracks;
            return ;
        }
    }
    
    this._id = id;
    this._title = "";
    this._tracks = [];
    
};

Playlist.prototype.save = function () {
    
    var i;
    var pls = Playlist.list();
    
    for(i=0; i<pls.length; i++) {
        if(pls[i].id == this._id) {
            pls[i].title = this._title;
            pls[i].tracks = this._tracks;
            localStorage.setItem('playlists', JSON.stringify(pls));
            return ;
        }
    }
    
    pls.push({
        id: this._id,
        title: this._title,
        tracks: this._tracks
    });
    
    localStorage.setItem('playlists', JSON.stringify(pls));
    
};

Playlist.prototype.id = function () { return this._id; }
Playlist.prototype.title = function () { return this._title; }
Playlist.prototype.tracks = function () { return this._tracks; }

Playlist.prototype.add = function (uri) {
    this._tracks.push(uri);
};

Playlist.prototype.remove = function (key) {
    this._tracks.splice(key, 1);
};

Playlist.prototype.move = function (key, pos) {
    var val = this._tracks.splice(key, 1)[0];
    this._tracks.splice((pos>key?--pos:pos), 0, val);
};
