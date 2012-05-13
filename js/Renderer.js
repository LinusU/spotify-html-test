
"use strict";

window.Renderer = {
    
    duration: function (d) {
        
        var s = Math.round(d / 1000) % 60;
        var m = Math.floor(d / 60000);
        
        return m + ':' + (s<10?'0':'') + s;
    },
    
    artists: function (as) {
        
        var r = '';
        
        for(var i=0; i<as.length; i++) {
            r += (r==''?'':', ') + '<a href="' + as[i].href + '">' + as[i].name + '</a>';
        }
        
        return r;
    },
    
    album: function (a) {
        return '<a href="' + a.href + '">' + a.name + '</a>';
    },
    
    header: function (ctx) {
        
        if(ctx == "starred" || ctx == "playlist" || ctx == "search" || ctx == "playqueue") {
            return '<tr><th class="col-fav"></th><th class="col-track">Track</th><th class="col-artist">Artist</th><th class="col-length">Time</th><th class="col-album">Album</th></tr>';
        }
        
        if(ctx == "album") {
            return '<tr><th class="col-fav"></th><th class="col-num"></th><th class="col-track">Track</th><th class="col-length">Time</th></tr>';
        }
        
        throw "Unknown context";
    },
    
    track: function (t, ctx) {
        
        if(ctx == "starred" || ctx == "playlist" || ctx == "playqueue") {
            return '<tr data-href="' + t.uri + '" draggable="true"><td class="col-fav"></td><td class="col-track"></td><td class="col-artist"></td><td class="col-length"></td><td class="col-album"></td></tr>';
        }
        
        if(ctx == "album" || ctx == "artist-album") {
            return '<tr data-href="' + t.uri + '" draggable="true"><td class="col-fav' + (t.starred?' starred':'') + '">\u2605</td><td class="col-num">' + t.number + '</td><td class="col-track">' + t.name + '</td><td class="col-length">' + Renderer.duration(t.duration) + '</td></tr>';
        }
        
        if(ctx == "search") {
            return '<tr data-href="' + t.uri + '" draggable="true"><td class="col-fav' + (t.starred?' starred':'') + '">\u2605</td><td class="col-track">' + t.name + '</td><td class="col-artist">' + Renderer.artists(t.artists) + '</td><td class="col-length">' + Renderer.duration(t.duration) + '</td><td class="col-album">' + Renderer.album(t.album) + '</td></tr>';
        }
        
        throw "Unknown context";
    },
    
    populate_track: function (t) {
        
        $('tr[data-href="' + t.uri + '"]')
            .find('.col-fav').text('\u2605')[t.starred?"addClass":"removeClass"]('starred').end()
            .find('.col-track').html(t.name).end()
            .find('.col-artist').html(Renderer.artists(t.artists)).end()
            .find('.col-length').html(Renderer.duration(t.duration)).end()
            .find('.col-album').html(Renderer.album(t.album));
        
    }
    
};
