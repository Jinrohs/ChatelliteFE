/**
 * @brief CZMLを生成しレスポンスするコントローラです。
 */

var configure = require('../configure');
var utility = require('../utility');
var superagent = require('superagent');
var merge = require('merge');
var commonProfiles = require('../resources/profile');

var createCzml = function(data, timeRange, profiles) {
    var czml = [getCzmlHeader(timeRange.startTime, timeRange.endTime)];    
    
    var resultSet = data.ResultSet;
    for(var id in resultSet) {
        var position = convertCatesianPosition(resultSet[id]);
        var packet = getCzmlPacket(id, timeRange, position, profiles[id]);
        czml.push(packet);
    }
        
    return czml;
};

var getCzmlHeader = function(startTime, endTime) {
    var header = { id: "document", name: "satecolle", version: "1.0", }; 
    if(startTime && endTime) {
        header.clock = {
            interval: utility.getIntervalStr(startTime, endTime),
            currentTime: utility.toTimeStringFormat(startTime),
            multiplier: configure.multiplier,
            range: "LOOP_STOP",
            step: "SYSTEM_CLOCK_MULTIPLIER"
        }
    }
    return header;
}

var getCzmlPacket = function(id, timeRange, position, profile) {        
    var packet = {};
    packet.id = "object/" + id + "/" + Math.round(timeRange.startTime.getTime() / 1000);
    packet.name = profile.name;
    packet.availability = [utility.getIntervalStr(timeRange.startTime, timeRange.endTime)];
    packet.billboard = {
        image: profile.icon.src,
        scale: profile.icon.scale,
        show: true
    };
    packet.label = {
        text: profile.name,
        fillColor: { rgba:[255, 255, 255, 255] },
        font: "11pt Lucida Console",
        horizontalOrigin: "LEFT",
        outlineColor: { rgba: [ 255,255,255,255 ] },
        outlineWidth: 2,
        pixelOffset: { cartesian2: [ 40, 10 ] },
        show: true,
        style: "FILL_AND_OUTLINE",
        verticalOrigin: "CENTER"
    };
    packet.position = {
        interpolationAlgorithm: "LAGRANGE",
        interpolationDegree: 5,
        referenceFrame: "INERTIAL",
        epoch: utility.toTimeStringFormat(timeRange.startTime),
        cartesian: position        
    };
    if(profile.path.show) {
        packet.path = {
            show: true,
            width: 1,
            material: {
                solidColor:{
                    color: {rgba: profile.path.color }
                }
            },
            resolution: 120
        };
    }
    return packet;    
}

var importLocalProfiles = function(language) {
    try {
        switch (language) {
            case "en":
                return require('../resources/profile-en');            
            case "ja":
                return require('../resources/profile-ja');
            default:
                return require('../resources/profile-' + configure.defaultLanguage);
        }        
    } catch(ex) {
        return require('../resources/profile-' + configure.defaultLanguage);
    }
}

var convertCatesianPosition = function(position) {
    var list = [];
    for(var i = 0; i < position.length; ++i) {
        for(n = 0; n < position[i].length; ++n) {
            list.push(position[i][n]);
        }
    }
    return list;
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
    superagent
        .get(url)
        .on('error', function(err) {
            console.log(err);
        }).end(function(err, res){
            if(res.body) {
                callback(res.body);
            }            
        });
};

var getOrbitApiUrl = function(startTime, endTime) {
    var url = "http://" + configure.orbitApi;
    var sTime = Math.round(startTime.getTime() / 1000);
    var eTime = Math.round(endTime.getTime() / 1000);
    return url + "/xyz?start=" + sTime + "&end=" + eTime;
};

module.exports = {
    handler: function(req, res) {
        var language = req.params.language || configure.defaultLanguage;
        var timeRange = parseRequestedTime(req.params.timerange);
        
        if(timeRange == undefined) {
            res.status(400);
            res.end("Specify starttime-endtime");
        }
        
        var localProfiles = importLocalProfiles(language);
        var profiles = merge.recursive(commonProfiles, localProfiles);
        
        loadOrbit(timeRange.startTime, timeRange.endTime, function(data) {
            var czml = createCzml(data, timeRange, profiles);
            res.json(czml);       
        });
    }
};
