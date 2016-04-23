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
    
    var documentPacket = profile.document(startTime, endTime);
    var ibukiPacket = createSatellitePacket('ibuki', startTime, endTime, ibukiPosition);
    var hinodePacket = createSatellitePacket('hinode', startTime, endTime, hinodePosition);
    var landsat8Packet = createSatellitePacket('landsat8', startTime, endTime, landsat8Position);

    var czml = [];
    czml.push(documentPacket);
    czml.push(ibukiPacket);
    czml.push(hinodePacket);
    czml.push(landsat8Packet);
    console.log(ibukiPacket.position.cartesian);
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
        console.log(res.text);
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