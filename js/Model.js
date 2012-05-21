
"use strict";

function Model () {}

Model.cache = {}

Model.fromURI = function (uri, cb) {
    
    var m;
    
    if(uri in Model.cache) {
        m = new this(Model.cache[uri]);
        setTimeout(cb, 1, m);
        return m;
    }
    
    m = new this();
    m.uri = uri;
    
    Spotify.getInstance().ajax(uri, function (data) {
        m._load(data[data.info.type]);
        cb(m);
    });
    
    return m;
}

Model.prototype._load = function (data) {
    throw "Abstract class";
}

Model.prototype.toString = function () {
    throw "Abstract class";
}
