
"use strict";

(function () {
    
    var $footer = $('footer');
    
    /* Skip to the previous track */
    $footer.on('click', '.btn-prev', function () {
        Spotify.getInstance().queue.previous();
    });
    
    /* Play */
    $footer.on('click', '.btn-play', function () {
        Spotify.getInstance().queue.playing(true);
        $(this).removeClass('btn-play').addClass('btn-pause');
    });
    
    /* Pause */
    $footer.on('click', '.btn-pause', function () {
        Spotify.getInstance().queue.playing(false);
        $(this).removeClass('btn-pause').addClass('btn-play');
    });
    
    /* Skip to the next track */
    $footer.on('click', '.btn-next', function () {
        Spotify.getInstance().queue.next();
    });
    
    /* Skip to specific position */
    $footer.find('progress').on('click', function (e) {
        
        /* Workaround for Firefox */
        if(e.offsetX == undefined) {
            e.offsetX = e.originalEvent.layerX;
        }
        
        var w = $(this).width();
        var p = e.offsetX / w;
        var m = $(this).prop('max');
        var v = Math.round(p * m);
        $(this).prop('value', v);
        Spotify.getInstance().queue.position(v);
        
    });
    
    /* Update the interface with the latest now playing data */
    $(document).on('queue-update', function () {
        
        var s = Spotify.getInstance();
        var q = s.queue;
        var p = q.position();
        var t = q.track();
        
        $('footer .btn-prev').toggleClass('disabled', !q.canPlayPrevious());
        $('footer .btn-next').toggleClass('disabled', !q.canPlayNext());
        $('footer .btn-play, footer .btn-pause').toggleClass('disabled', !q.canPlayPause());
        
        if(q.playing()) {
            $('footer .btn-play').removeClass('btn-play').addClass('btn-pause');
        } else {
            $('footer .btn-pause').removeClass('btn-pause').addClass('btn-play');
        }
        
        if(s.uri == "spotify:playqueue") {
            s.reload();
        }
        
        $('footer .txt-pos').text(Spotify.Renderer.duration(p));
        $('footer progress').prop('value', p);
        
        if(t) {
            Track.fromURI(t, function (t) {
                $('footer progress').prop('max', t.duration);
                $('footer .txt-dur').text(Spotify.Renderer.duration(t.duration));
                $('.now-playing span').eq(0).text(t.name).end().eq(1).html(Spotify.Renderer.album(t.album));
            });
        } else {
            $('.now-playing span').text('');
            $('footer progress').prop('max', 1);
            $('footer .txt-dur').text(Spotify.Renderer.duration(0));
        }
        
    }).trigger('queue-update');
    
    (function () {
        
        var q = Spotify.getInstance().queue;
        var $pos = $('footer .txt-pos');
        var $pro = $('footer progress');
        
        setInterval(function () {
            var p = q.position();
            $pos.text(Spotify.Renderer.duration(p));
            $pro.prop('value', p);
        }, 350);
        
    })();
    
})();
