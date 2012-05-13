
"use strict";

function Player () {
    
    this._timeout = null;
    
    this._iframe = $('<iframe />').css({
        position: 'absolute',
        top: -100,
        left: -100,
        width: 50,
        height: 50
    }).appendTo('body')[0];
    
}

Player.prototype._clear = function () {
    clearTimeout(this._timeout);
    this._timeout = null;
}

Player.prototype.stop = function () {
    if(this._timeout) { this._clear(); }
    this._iframe.src = "spotify:track:764cu9dFplkOmG16J6aX8G#6:05";
}

Player.prototype.play = function (track, pos) {
    if(this._timeout) { this._clear(); }
    this._iframe.src = track.uri + '#' + Renderer.duration(pos || 0);
    this._timeout = setTimeout(function (o) {
        o.stop();
    }, track.duration - 100, this);
}
