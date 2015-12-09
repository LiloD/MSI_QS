var fs = require('fs');
var parse = require('./parse');
var db = require('./db');
var Q = require('q');

Q.nfcall(fs.readdir, 'data').then(function(files) {
    var result = Q()
    files.forEach(function(file) {
console.log('read', file);
        if (!file.endsWith('txt')) return;
        result = result.then(function() {
            return Q.nfcall(fs.readFile, 'data/' + file, 'utf8')
        }).then(parse).then(db.save)
    })
    return result
}).catch(console.error)

