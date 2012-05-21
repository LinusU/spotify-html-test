
"use strict";

(function () {
    
    $(document).on('keydown', function (e) {
        
        var el = document.getElementById('selected');
        var $el;
        
        if(!el) { return ; }
        
        $el = $(el);
        
        if($el.is('tr')) {
            
            /* Move selected up */
            if(e.keyCode == 38) {
                $el = $el.prev('tr');
                if($el.length && $el.children('td').length) {
                    el.id = "";
                    $el[0].id = "selected";
                }
                e.preventDefault();
            }
            
            /* Move selected down */
            if(e.keyCode == 40) {
                $el = $el.next('tr');
                if($el.length) {
                    el.id = "";
                    $el[0].id = "selected";
                }
                e.preventDefault();
            }
            
            /* Delete current track from playlist */
            if(e.keyCode == 8 || e.keyCode == 46) {
                
                if(Spotify.getInstance().uri.substring(0, 17) == "spotify:playlist:") {
                    
                    var p = new Playlist(Spotify.getInstance().uri.substring(17));
                    
                    p.remove($el.index() - 1);
                    p.save();
                    
                    $el.remove();
                    
                }
                
                e.preventDefault();
                
            }
            
        }
        
        if($el.is('li')) {
            
            /* Move one playlist up */
            if(e.keyCode == 38) {
                $el.prev('li[href]').trigger('click');
                e.preventDefault();
            }
            
            /* Move one playlist down */
            if(e.keyCode == 40) {
                $el.next('li[href]').trigger('click');
                e.preventDefault();
            }
            
            /* Delete current playlist */
            if(e.keyCode == 8 || e.keyCode == 46) {
                
                var p = new Playlist(el.getAttribute('href').substring(18));
                
                if(confirm('Are you sure that you want to remove the playlist "' + p.title() + '"?')) {
                    Playlist.remove(p.id());
                    $el.remove();
                }
                
                e.preventDefault();
                
            }
        }
        
    });
    
})();
