
"use strict";

(function () {
    
    /* Navigate to selected playlist or source */
    $('nav').on('click', 'li[href]', function (e) {
        
        var sel;
        var href = this.getAttribute('href');
        
        if(href) {
            
            sel = document.getElementById('selected');
            
            if(sel) { sel.id = ""; }
            
            this.id = "selected";
            location.href = href;
            
            e.preventDefault();
            
        }
        
    });
    
    /* Dropping tracks to playqueue */
    $('.nav-playqueue').on('dragenter', function (e) {
        $(this).addClass('dropping');
        e.originalEvent.dataTransfer.dropEffect = "copy";
        e.preventDefault();
    });
    
    $('.nav-playqueue').on('dragover', function (e) {
        e.preventDefault();
    });
    
    $('.nav-playqueue').on('dragleave', function (e) {
        $(this).removeClass('dropping');
        e.preventDefault();
    });
    
    $('.nav-playqueue').on('drop', function (e) {
        
        var uri;
        
        $(this).removeClass('dropping');
        
        uri = e.originalEvent.dataTransfer.getData('text/uri-list');
        
        if(uri.substring(0, 8) == "spotify:") {
            Spotify.getInstance().queue.enqueue(uri);
        }
        
        e.preventDefault();
        
    });
    
    /* Create a new playlist */
    $('#nav-newplaylist').on('click', function () {
        
        var p;
        var title = prompt("Please provide a title for the new playlist:");
        
        if(!title) { return ; }
        
        p = Playlist.create(title);
        
        $('#playlists').append('<li href="#spotify:playlist:' + p.id() + '"><b></b>' + p.title() + '</li>');
        
    });
    
    /* List all playlists */
    (function () {
        
        var i;
        var pls = Playlist.list();
        var $pls = $('#playlists');
        
        /* Add them to left column */
        for(i=0; i<pls.length; i++) {
            $pls.append('<li href="#spotify:playlist:' + pls[i].id + '"><b></b>' + pls[i].title + '</li>');
        }
        
        /* Drop tracks to playlist */
        $pls.on('dragenter', 'li', function (e) {
            $(this).addClass('dropping');
            e.originalEvent.dataTransfer.dropEffect = "copy";
            e.preventDefault();
        });
        
        $pls.on('dragover', 'li', function (e) {
            e.preventDefault();
        });
        
        $pls.on('dragleave', 'li', function (e) {
            $(this).removeClass('dropping');
            e.preventDefault();
        });
        
        $pls.on('drop', 'li', function (e) {
            
            var p, href, uri;
            
            $(this).removeClass('dropping');
            
            href = this.getAttribute('href');
            p = new Playlist(href.substring(18));
            
            uri = e.originalEvent.dataTransfer.getData('text/uri-list');
            
            if(uri.substring(0, 8) == "spotify:") {
                p.add(uri);
                p.save();
            }
            
            e.preventDefault();
            
        });
        
    })();
    
})();
