
"use strict";

(function () {
    
    /* Star/Unstar tracks */
    $('div[role="main"]').on('click', 'td.col-fav', function (e) {
        var val, href = this.parentNode.getAttribute('href');
        if(href) {
            val = $(this).hasClass('starred');
            $('tr[href="' + href + '"] .col-fav')[val?"removeClass":"addClass"]('starred');
            Spotify.getInstance().starred(href, !val);
        }
    });
    
    /* Select track */
    $('div[role="main"]').on('click', 'tr', function (e) {
        var el = document.getElementById('selected');
        if(el) { el.id = ""; }
        this.id = "selected";
    });
    
    /* Set the playqueue and start playing on clicked track */
    $('div[role="main"]').on('dblclick', 'tr', function (e) {
        
        var $rows = $(this).parent().find('tr[href]');
        var tracks = [];
        var index = $rows.index(this);
        
        $rows.each(function () {
            tracks.push(this.getAttribute('href'));
        });
        
        Spotify.getInstance().queue.setQueue(tracks, index);
        
    });
    
    /* Drag and drop tracks */
    $('div[role="main"]').on('dragstart', 'tr', function (e) {
        
        var img = $('<div>' + $(this).find('.col-track').text() + ' by ' + $(this).find('.col-artist').text() + '</div>').css({ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid black', color: 'black', padding: 2, float: 'left' }).appendTo('body')[0];
        
        e.originalEvent.dataTransfer.setData('text/plain', $(this).index() - 1);
        e.originalEvent.dataTransfer.setData('text/uri-list', $(this).attr('href'));
        e.originalEvent.dataTransfer.setDragImage(img, 1, 18);
        
        $(this).css('opacity', .4);
        
    });
    
    $('div[role="main"]').on('dragend', 'tr', function (e) {
        $(this).css('opacity', '');
    });
    
    $('div[role="main"]').on('dragenter', '.playlist tr', function (e) {
        $(this).addClass('dropping');
        e.originalEvent.dataTransfer.dropEffect = "move";
        e.preventDefault();
    });
    
    $('div[role="main"]').on('dragover', '.playlist tr', function (e) {
        e.preventDefault();
    });
    
    $('div[role="main"]').on('dragleave', '.playlist tr', function (e) {
        $(this).removeClass('dropping');
    });
    
    $('div[role="main"]').on('drop', '.playlist tr', function (e) {
        
        var p, idx, index;
        
        p = new Playlist(Spotify.getInstance().uri.substring(17));
        idx = parseInt(e.originalEvent.dataTransfer.getData('text/plain'), 10);
        index = $(this).removeClass('dropping').index();
        
        if(idx != index && idx != index - 1) {
            
            p.move(idx, index);
            p.save();
            
            $(this).parent().find('tr').eq(++idx).insertAfter(this);
            
        }
        
    });
    
})();
