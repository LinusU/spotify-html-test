
"use strict";

if(!window.Spotify) {
    throw "Include Spotify first";
}

Spotify.Views = {
    
    Welcome: function (spotify, uri, cb) {
        $.ajax({
            cache: true,
            dataType: 'html',
            success: cb,
            url: 'start.html'
        });
    },
    
    PlayQueue: function (spotify, uri, cb) {
        
        var i, t, ts;
        var html = '<table class="playqueue">';
        
        html += Spotify.Renderer.header('playqueue');
        
        t = spotify.queue.track();
        
        if(t) {
            html += Spotify.Renderer.track(Track.fromURI(t, Spotify.Renderer.populate_track), 'playqueue');
        }
        
        ts = spotify.queue.queue();
        
        for(i=0; i<ts.length; i++) {
            html += Spotify.Renderer.track(Track.fromURI(ts[i], Spotify.Renderer.populate_track), 'playqueue');
        }
        
        cb(html + '</table>');
        
    },
    
    Starred: function (spotify, uri, cb) {
        
        var i;
        var ts = JSON.parse(localStorage.getItem('starred') || "[]");
        var html = '<div class="starred">';
        
        html += '<b class="img-top" />';
        html += '<h1>Starred tracks</h1>';
        
        html += '<table>';
        html += Spotify.Renderer.header("starred");
        
        for(i=ts.length-1; i>=0; i--) {
            html += Spotify.Renderer.track(Track.fromURI(ts[i], Spotify.Renderer.populate_track), "starred");
        }
        
        cb(html + '</table></div>');
        
    },
    
    Playlist: function (spotify, uri, cb) {
        
        var i;
        var p = new Playlist(uri.substring(17));
        var ts = p.tracks();
        var html = '<div class="playlist">';
        
        html += '<b class="img-top" />';
        html += '<h1>' + p.title() + '</h1>';
        
        html += '<table>';
        html += Spotify.Renderer.header("playlist");
        
        for(i=0; i<ts.length; i++) {
            html += Spotify.Renderer.track(Track.fromURI(ts[i], Spotify.Renderer.populate_track), "playlist");
        }
        
        cb(html + '</table></div>');
        
    },
    
    Album: function (spotify, uri, cb) {
        return spotify.ajax(uri, function (data) {
            
            var i;
            var a = new Album(data.album);
            var html = '<div class="album">';
            
            html += '<b class="img-top" />';
            
            html += (
                '<div class="wrap">' +
                '<h1>' + a.name + ' <span>(' + a.year + ')</span></h1>' +
                '<h2>by ' + Spotify.Renderer.artist(a.artist) + '</h2>' +
                '</div>'
            );
            
            html += '<table>';
            
            for(i=0; i<a.tracks.length; i++) {
                html += Spotify.Renderer.track(a.get(i), "album");
            }
            
            html += '</table>';
            
            html += '<p>' + a.year + ', Record Label Name.</p>';
            
            cb(html + '</div>');
            
        });
    },
    
    Artist: function (spotify, uri, cb) {
        return spotify.ajax(uri, function (data) {
            
            var i;
            var html = '<div class="artist">';
            
            html += '<b class="img-top" />';
            html += '<h1>' + data.artist.name + '</h1>';
            
            html += '<h2>Albums</h2>';
            
            for(i=0; i<data.artist.albums.length; i++) {
                (function (album) {
                    
                    if(!/(^| )SE( |$)/.exec(album.availability.territories)) {
                        return ;
                    }
                    
                    html += (
                        '<div class="artist-album" id="' + album.href + '">' +
                        '<b class="img-album" />' +
                        '<div class="wrap">' +
                        '<h3>' + Spotify.Renderer.album(album) + ' <span></span></h3>' +
                        '<table></table>' +
                        '</div>' +
                        '</div>'
                    );
                    
                    Album.fromURI(album.href, function (a) {
                        
                        var i;
                        var $a = $(document.getElementById(album.href));
                        var $table = $a.find('table');
                        
                        $a.find('h3 span').text('(' + a.year + ')');
                        
                        for(i=0; i<a.tracks.length; i++) {
                            $table.append(Spotify.Renderer.track(a.get(i), "artist-album"));
                        }
                        
                    });
                    
                }).call(this, data.artist.albums[i].album);
            }
            
            cb(html + '</div>');
            
        });
    },
    
    Search: function (spotify, uri, cb) {
        return spotify.ajax("spotify:search:track:" + uri.substring(15), function (data) {
            
            this.ajax("spotify:search:artist:" + uri.substring(15), function (data) {
                
                var i, html = '<h1>Artists</h1>';
                
                for(i=0; i<Math.min(data.artists.length, 5); i++) {
                    html += '<div><b class="img-artist"></b> ' + Spotify.Renderer.artist(data.artists[i]) + '</div>';
                }
                
                $('.search-artist').html(html);
                
            });
            
            this.ajax("spotify:search:album:" + uri.substring(15), function (data) {
                
                var i, html = '<h1>Albums</h1>';
                
                for(i=0; i<Math.min(data.albums.length, 5); i++) {
                    html += (
                        '<div>' +
                        '<b class="img-album"></b> ' +
                        Spotify.Renderer.album(data.albums[i]) + '<br />' +
                        '<span>' + Spotify.Renderer.artists(data.albums[i].artists) + '</span>' +
                        '</div>'
                    );
                }
                
                $('.search-album').html(html);
                
            });
            
            var i, html = '<div class="search"><div class="search-artist"></div><div class="search-album"></div></div><table class="search">';
            
            html += Spotify.Renderer.header("search");
            
            for(i=0; i<data.tracks.length; i++) {
                html += Spotify.Renderer.track(new Track(data.tracks[i]), "search");
            }
            
            cb(html + '</table>');
            
        });
    }
    
};
