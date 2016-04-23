/**
 * @brief CZMLを生成しレスポンスするコントローラです。
 */

var fs = require('fs');
var http = require('http');
var configure = require('../configure');
var profile = require('../resouces/profile');

/**
 * 初回のCZMLをレスポンスします。
 */
var renderDefault = function(req, res) {
    fs.readFile(`${__dirname}/../public/default.czml`, 'UTF-8', function(err, data) {
        res.json(JSON.parse(data));
    });
};

var renderNextCzml = function(req, res) {
    var option = req.params.option;
    if(option == undefined) {
        res.status(404);
        res.end("Specify starttime-endtime");
    }
    
    var time = parseRequestedTime(option);
    loadOrbit(time.startTime, end.endTime, function(data) {
        res.json(createCzml(data));
    });
};

var createCzml = function(data) {
    
};

var parseRequestedTime = function(option) {
    var val = option.split("-");
    return {
        "startTime": new Date(Number(val[0]) * 1000),
        "endTime": new Date(Number(val[1]) * 1000)
    };    
}

/**
 * APIから軌道などを取得します。 
 * @param startTime 取得開始日時
 * @param endTime 取得終了日時
 * @param callback コールバック関数
 */
var loadOrbit = function(startTime, endTime, callback) {
    var url = getOrbitApiUrl(startTime, endTime);
    http.get(url, callback(res)).on('error', function(err) {
        console.log(err);
    });
};

var getOrbitApiUrl = function(startTime, endTime) {
    var url = "http://" + onfigure.orbitApi + ":" + configure.orbitApiPort;
    var sTime = (typeof startTime == "number" ? startTime : startTime.getTime() / 1000);
    var eTime = (typeof endTime == "number" ? endTime : endTime.getTime() / 1000);
    return url + "/?startTime=" + sTime + "&endTime=" + eTime + "&interval=" + configure.orbitIntervalSec; 
};

module.exports = {
    handler: function(req, res) {
        var command = req.params.command;
        var option = req.params.option;
        console.log("command:" + command);
        console.log("option:" + option);
        
        switch(command) {
            case 'default':
                renderDefault(req, res);
                break;
            case 'positions':
                renderNextCzml(req, res);
        }
            
            
        
        
        
    }
}; 