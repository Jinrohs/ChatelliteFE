/**
 * @brief CZMLを生成しレスポンスするコントローラです。
 */

var fs = require('fs');
var http = require('http');
var configure = require('../configure');
var profile = require('../resouces/profile');
var utility = require('../utility');
var dummy = require('../resouces/dummy');
var superagent = require('superagent');

/**
 * 初回のCZMLをレスポンスします。
 */
var renderDefault = function(req, res) {
    res.json(createDefaultCzml());
};

var createDefaultCzml = function() {
    var czml = [];
    czml.push(profile.document());
    czml.push(profile.ibukiDefault());
    czml.push(profile.hinodeDefault());
    czml.push(profile.landsat8Default());
    czml.push(profile.debris1Default());
    return czml;    
};

var renderNextCzml = function(req, res) {
    var option = req.params.option;
    if(option == undefined) {
        res.status(404);
        res.end("Specify starttime-endtime");
    }
    
    var time = parseRequestedTime(option);
    loadOrbit(time.startTime, time.endTime, function(data) {
        var czml = createCzml(data, time.startTime, time.endTime);
        res.json(czml);       
    });
};

var createCzml = function(data, startTime, endTime) {
    data = JSON.parse(data);
    var resultSet = data.ResultSet;

    var ibukiPosition = convertCatesianPosition(resultSet[nameToCode('ibuki')]);
    var hinodePosition = convertCatesianPosition(resultSet[nameToCode('hinode')]);
    var landsat8Position = convertCatesianPosition(resultSet[nameToCode('landsat8')]);
    var debris1Position = convertCatesianPosition(resultSet[nameToCode('debris1')]);
    
    var documentPacket = profile.document(startTime, endTime);
    var ibukiPacket = createSatellitePacket('ibuki', startTime, endTime, ibukiPosition);
    var hinodePacket = createSatellitePacket('hinode', startTime, endTime, hinodePosition);
    var landsat8Packet = createSatellitePacket('landsat8', startTime, endTime, landsat8Position);
    var debris1Packet = createSatellitePacket('debris1', startTime, endTime, debris1Position);
    console.log(debris1Packet);
    var czml = [];
    czml.push(documentPacket);
    czml.push(ibukiPacket);
    czml.push(hinodePacket);
    czml.push(landsat8Packet);
    czml.push(debris1Packet);
    return czml;
};

var convertCatesianPosition = function(position) {
    var list = [];
    for(var i = 0; i < position.length; ++i) {
        for(n = 0; n < position[i].length; ++n) {
            list.push(position[i][n]);
        }
    }
    return list;
};

var createSatellitePacket = function(name, startTime, endTime, position, message) {
    var obj = new Object();
    var index = Math.round(startTime.getTime() / 1000);
    switch(name) {
        case "hinode":
            obj = profile.hinode(index, startTime, endTime, message);
            break;
        case "ibuki":
            obj = profile.ibuki(index, startTime, endTime, message);
            break;
        case "landsat8":
            obj = profile.landsat8(index, startTime, endTime, message);
            break;
        case "debris1":
            obj = profile.debris1(index, startTime, endTime, message);
            break;
    }
    obj.position = {
        interpolationAlgorithm: "LAGRANGE",
        interpolationDegree: 5,
        referenceFrame: "INERTIAL",
        epoch: utility.toTimeStringFormat(startTime),
        cartesian: position
    };
    return obj;
};

var codeToName = function(code) {
    switch(code) {
        case 29479:
            return "hinode";
        case 33492:
            return "ibuki";
        case 39084:
            return "landsat8";
        case 32038:
            return "debris1";
        default:
            return -1;
    }
}

var nameToCode = function(name) {
    switch(name) {
        case "hinode":
            return 29479;
        case "ibuki":
            return 33492;
        case "landsat8":
            return 39084;
        case "debris1":
            return 32038;
        default:
            return -1;
    }
}

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
    // dummy
    /*
    if(false) { 
        callback(dummy.cartesian1);
        return;
    }*/
    
    var url = getOrbitApiUrl(startTime, endTime);    
    superagent.get(url).end(function(err, res){
        callback(res.text);        
    });
};

var getOrbitApiUrl = function(startTime, endTime) {
    var url = "http://" + configure.orbitApi + ":" + configure.orbitApiPort;
    var sTime = Math.round(startTime.getTime() / 1000);
    var eTime = Math.round(endTime.getTime() / 1000);
    return url + "/xyz?start=" + sTime + "&end=" + eTime; 
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
            case 'get':
                renderNextCzml(req, res);
        }
    }
}; 