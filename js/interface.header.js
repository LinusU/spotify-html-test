
"use strict";

(function () {
    
    $('header input').on('keypress', function (e) {
        
        var v;
        
        /* Search when <enter> is pressed */
        if(e.keyCode == 13) {
            v = this.value;
            (document.getElementById('selected') || {}).id = "";
            location.href = '#' + ((v.substring(0, 8)=='spotify:'?'':'spotify:search:')+v);
        }
        
    });
    
})();
