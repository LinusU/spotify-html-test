
"use strict";

function PlayQueue() {
    
    this._player = new Player();
    
    this._playing = false;
    this._pos = { pos: 0, lastUpdated: null };
    
    this._played = [];
    this._current = null;
    this._queue = [];
    
    this._repeat = false;
    this._shuffle = false;
    
    this._timeout = null;
    
    this._backend = null;
    
}

/* Getter and Setter */

PlayQueue.prototype.playing = function (value) {
    
    var p;
    
    if(arguments.length) {
        p = this.position();
        this._playing = !!value;
        this._clear();
        if(this._playing) {
            this.position(p);
        } else {
            this._backendFn('stop');
        }
    }
    
    return this._playing;
};

PlayQueue.prototype.position = function (value) {
    
    var that = this;
    
    if(arguments.length) {
        
        this._pos = {
            pos: value,
            lastUpdated: (new Date()).getTime()
        };
        
        if(this._current && this._playing) {
            
            this._clear();
            
            Track.fromURI(this._current, function (t) {
                
                var p = that.position();
                
                if(p > t.duration) {
                    that.next();
                } else {
                    that._timeout = setTimeout(function () {
                        that._timeout = null;
                        that.next();
                    }, t.duration - p);
                }
                
                that._backendFn('play', t, p);
                
            });
            
        }
        
    } else if(this._playing) {
        
        this._pos = {
            pos: this._pos.pos + ((new Date()).getTime() - this._pos.lastUpdated),
            lastUpdated: (new Date()).getTime()
        };
        
    }
    
    return this._pos.pos;
};

PlayQueue.prototype.repeat = function (value) {
    if(arguments.length) { this._repeat = !!value; }
    return this._repeat;
};

PlayQueue.prototype.shuffle = function (value) {
    if(arguments.length) { this._shuffle = !!value; }
    return this._shuffle;
};

PlayQueue.prototype.track = function (value) {
    /*if(arguments.length) { this._current = value; }*/
    /* FIXME: return track object and not just id? */
    return this._current;
};

PlayQueue.prototype.queue = function (value) {
    return this._queue;
};

PlayQueue.prototype.canPlayPrevious = function () {
    return (!!this._played.length) || (this.position() > 1500);
};

PlayQueue.prototype.canPlayNext = function () {
    return !!this._current;
};

PlayQueue.prototype.canPlayPause = function () {
    return !!this._current;
};

/* Functions */

PlayQueue.prototype._backendFn = function (fn, track, pos) {
    if(this._backend) { this._backend[fn](track, pos); }
};

PlayQueue.prototype._clear = function () {
    if(this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
    }
};

PlayQueue.prototype._trigger = function (timeout) {
    setTimeout(function () {
        $(document).trigger('queue-update');
    }, 1 + (timeout || 0));
};

PlayQueue.prototype.enqueue = function (item) {
    
    this._queue.push(item);
    
    if(!this._current) {
        this.next();
    }
    
    this._trigger();
    
};

PlayQueue.prototype.next = function () {
    
    if(this._current) {
        this._played.push(this._current);
    }
    
    if(this._queue.length) {
        this._current = this._queue.shift();
        this._playing = true;
        this.position(0);
    } else {
        this._current = null;
        this._playing = false;
        this._pos.pos = 0;
        this._backendFn('stop');
    }
    
    this._trigger();
    this._trigger(1500);
    
};

PlayQueue.prototype.previous = function () {
    
    if(this.position() <= 1500) {
        
        if(!this._played.length) {
            return ;
        }
        
        this._current = this._played.pop();
        this._playing = true;
        
        if(this._current) {
            this._queue.unshift(this._current);
        }
        
    }
    
    this.position(0);
    
    this._trigger();
    this._trigger(1500);
    
};

PlayQueue.prototype.setQueue = function (tracks, index) {
    
    var i;
    
    this._played = [];
    this._current = null;
    this._queue = [];
    
    for(i=0; i<tracks.length; i++) {
        this[i<index?"_played":"_queue"].push(tracks[i]);
    }
    
    this.next();
    
};
