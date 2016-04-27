'use strict'

var configure = require('../configure');
var superagent = require('superagent');

var loadSpeech = function(id, timestamp, callback) {
    var params = {
        id: id,
        timestamp: timestamp
    };

    superagent
        .get(configure.speechApi)
        .query(params)
        .end(function(err, res) {
            if (err) {
                return;
            }

            callback(res.body);
        });
};

module.exports = {
    handler: function(req, res) {
        var id = req.params.id;
        var timestamp = req.params.timestamp;
        console.log(id);
        loadSpeech(id, timestamp, function(data) {
            res.json(data);
        });
    }
};
