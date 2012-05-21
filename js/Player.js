
"use strict";

function Player () {
    
    this._iframe = $('<iframe />').css({
        position: 'absolute',
        top: -100,
        left: -100,
        width: 50,
        height: 50
    }).appendTo('body')[0];
    
}

Player.prototype.stop = function () {
    /* Last song in album, end of song. Kind of hacky */
    this._iframe.src = "spotify:track:764cu9dFplkOmG16J6aX8G#6:05";
}

Player.prototype.play = function (track, pos) {
    /* This will launch Spotify and make it play the track */
    this._iframe.src = track.uri + '#' + Spotify.Renderer.duration(pos || 0);
}
