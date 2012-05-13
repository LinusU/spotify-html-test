
"use strict";

function Spotify () {
    
    this.uri = "";
    this.queue = new PlayQueue();
    
    this.Welcome = function (uri, cb) {
        $.ajax({
            cache: true,
            dataType: 'html',
            success: cb,
            url: 'start.html'
        });
    };
    
    this.PlayQueue = function (uri, cb) {
        
        var i, t, ts;
        var html = '<table class="playqueue">';
        
        html += Renderer.header('playqueue');
        
        t = this.queue.track();
        
        if(t) {
            html += Renderer.track(Track.fromURI(t, Renderer.populate_track), 'playqueue');
        }
        
        ts = this.queue.queue();
        
        for(i=0; i<ts.length; i++) {
            html += Renderer.track(Track.fromURI(ts[i], Renderer.populate_track), 'playqueue');
        }
        
        cb(html + '</table>');
        
    };
    
    this.Starred = function (uri, cb) {
        
        var i;
        var ts = JSON.parse(localStorage.getItem('starred') || "[]");
        var html = '<div class="starred">';
        
        html += '<b class="img-top" />';
        html += '<h1>Starred tracks</h1>';
        
        html += '<table>';
        html += Renderer.header("starred");
        
        for(i=ts.length-1; i>=0; i--) {
            html += Renderer.track(Track.fromURI(ts[i], Renderer.populate_track), "starred");
        }
        
        cb(html + '</table></div>');
        
    };
    
    this.Playlist = function (uri, cb) {
        
        var i;
        var p = new Playlist(uri.substring(17));
        var ts = p.tracks();
        var html = '<div class="playlist">';
        
        html += '<b class="img-top" />';
        html += '<h1>' + p.title() + '</h1>';
        
        html += '<table>';
        html += Renderer.header("playlist");
        
        for(i=0; i<ts.length; i++) {
            html += Renderer.track(Track.fromURI(ts[i], Renderer.populate_track), "playlist");
        }
        
        cb(html + '</table></div>');
        
    };
    
    this.Album = function (uri, cb) {
        return this.ajax(uri, function (data) {
            
            var i;
            var $div = $('<div class="album" />');
            var $table = $('<table />');
            
            $div.append('<b class="img-top" />');
            
            $div.append(
                '<div class="wrap">' +
                '<h1>' + data.album.name + ' <span>(' + data.album.released + ')</span></h1>' +
                '<h2>by <a href="' + data.album['artist-id'] + '">' + data.album.artist + '</a></h2>' +
                '</div>'
            );
            
            for(i=0; i<data.album.tracks.length; i++) {
                data.album.tracks[i].album = data.album;
                $table.append(Renderer.track(new Track(data.album.tracks[i]), "album"));
            }
            
            cb($div.append($table).append('<p>' + data.album.released + ', Record Label Name.</p>'));
            
        });
    };
    
    this.Artist = function (uri, cb) {
        return this.ajax(uri, function (data) {
            
            var i;
            var $div = $('<div class="artist" />');
            
            $div.append('<b class="img-top" />');
            $div.append('<h1>' + data.artist.name + '</h1>');
            
            $div.append('<h2>Albums</h2>');
            
            for(i=0; i<data.artist.albums.length; i++) {
                (function (album) {
                    
                    $div.append(
                        '<div class="artist-album" id="' + album.href + '">' +
                        '<b class="img-album" />' +
                        '<div class="wrap">' +
                        '<h3>' + Renderer.album(album) + ' <span></span></h3>' +
                        '<table></table>' +
                        '</div>' +
                        '</div>'
                    );
                    
                    this.ajax(album.href, function (data) {
                        
                        var i;
                        var $a = $(document.getElementById(album.href));
                        var $table = $a.find('table');
                        
                        $a.find('h3 span').text('(' + data.album.released + ')');
                        
                        for(i=0; i<data.album.tracks.length; i++) {
                            data.album.tracks[i].album = data.album;
                            $table.append(Renderer.track(new Track(data.album.tracks[i]), "artist-album"));
                        }
                        
                    });
                    
                }).call(this, data.artist.albums[i].album);
            }
            
            cb($div);
            
        });
    };
    
    this.Search = function (uri, cb) {
        return this.ajax("spotify:search:track:" + uri.substring(15), function (data) {
            
            var i, html = '<table class="search">';
            
            html += Renderer.header("search");
            
            for(i=0; i<data.tracks.length; i++) {
                html += Renderer.track(new Track(data.tracks[i]), "search");
            }
            
            cb(html + '</table>');
            
        });
    };
    
}

Spotify._instance = null;
Spotify.getInstance = function () {
    return Spotify._instance || (Spotify._instance = new Spotify());
};

Spotify.prototype.starred = function (uri, value) {
    
    var list = JSON.parse(localStorage.getItem('starred') || "[]");
    var idx = list.indexOf(uri);
    
    if(arguments.length > 1) {
        if(value && idx == -1) { list.push(uri); }
        if(!value && idx != -1) { list.splice(idx, 1); }
        localStorage.setItem('starred', JSON.stringify(list));
    }
    
    return (idx != -1);
};

Spotify.prototype.load = function (uri) {
    
    var parts = uri.split(':');
    var $main = $('div[role="main"]');
    
    var cb = function (html) {
        $main.append(html).removeClass('loading');
    };
    
    $main.html('').addClass('loading');
    
    this.uri = uri;
    
    switch(parts[1]) {
        case 'artist': return this.Artist(uri, cb);
        case 'album': return this.Album(uri, cb);
        case 'track': return this.Track(uri, cb);
        case 'playlist': return this.Playlist(uri, cb);
        case 'starred': return this.Starred(uri, cb);
        case 'welcome': return this.Welcome(uri, cb);
        case 'search': return this.Search(uri, cb);
        case 'playqueue': return this.PlayQueue(uri, cb);
    }
    
    $main.removeClass('loading');
    
    return false;
};

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
        cache: true,
        context: this,
        dataType: 'json',
        success: cb,
        url: url
    });
    
};
