var utility = require('../utility');
var configure = require('../configure');

var createLabel = function(name, message) {
    var content = name
    if(message != undefined) {
        content += " 「" + message + "」";
    }

    return {
        "text": content,
        "fillColor":{
           "rgba":[
              255,255,255,255
           ]
        },
        "font":"11pt Lucida Console",
        "horizontalOrigin":"LEFT",
        "outlineColor":{
            "rgba":[
                255,255,255,255
            ]
         },
        "outlineWidth":2,
        "pixelOffset":{
            "cartesian2":[
                40, 10
            ]
        },
        show: true,
        style: "FILL_AND_OUTLINE",
        verticalOrigin: "CENTER"
    };
};

module.exports = {    
    document: function(startTime, endTime) {
        if(startTime == undefined || endTime == undefined) {
            return {
                id: "document",
                name: "satecolle",
                version: "1.0",                
            };
        }
        return {
            id: "document",
            name: "satecolle",
            version: "1.0",
            clock :{
                interval: utility.getIntervalStr(startTime, endTime),
                currentTime: utility.toTimeStringFormat(startTime),
                multiplier: configure.multiplier,
                range: "LOOP_STOP",
                step: "SYSTEM_CLOCK_MULTIPLIER"
            }
        };
    },

    hinodeDefault: function() {
        return {
            id: "satellite/hinode/default",
            name: "hinode"
        };
    },

    hinode: function(index, startTime, endTime, message) {
        return {
            id: "satellite/hinode/" + index,
            name: "hinode",
            availability: [utility.getIntervalStr(startTime, endTime)],
            parent: "satellite/hinode/default",
            billboard: {
                image: "/images/hinode-icon.png",
                scale: 1.0,
                show: true
            },
            label: createLabel("ひので", message),
            path: {
                show: true,
                width: 1,
                material: {
                    solidColor:{
                        color: {rgba:[ 255, 150, 255, 255 ] }
                    }
                },
                resolution: 120
            }
        };
    },

    ibukiDefault: function() {
        return {
            id: "satellite/ibuki/default",
            name: "hinode"
        };
    },

    ibuki: function(index, startTime, endTime, message) {
        return {
            id: "satellite/ibuki/" + index,
            name: "ibuki",
            availability: [utility.getIntervalStr(startTime, endTime)],
            parent: "satellite/ibuki/default",
            billboard: {
                image: "/images/ibuki-icon.png",
                scale: 1.0,
                show: true
            },
            label: createLabel("いぶき", message),
            path: {
                show: true,
                width: 1,
                material: {
                    solidColor:{
                        color: {rgba:[ 150, 255, 255, 255 ] }
                    }
                },
                resolution: 120
            }
        };
    },

    landsat8Default: function() {
        return {
            id: "satellite/landsat8/default",
            name: "hinode"
        };
    },

    landsat8: function(index, startTime, endTime, message) {
        return {
            id: "satellite/landsat8/" + index,
            name: "landsat8",
            availability: [utility.getIntervalStr(startTime, endTime)],
            parent: "satellite/landsat8/default",
            billboard: {
                image: "/images/landsat8-icon.png",
                scale: 1.0,
                show: true
            },
            label: createLabel("LandSat8", message),
            path: {
                show: true,
                width: 1,
                material: {
                    solidColor:{
                        color: {rgba:[ 255, 255, 150, 255 ] }
                    }
                },
                resolution: 120
            }
        };
    },
    
    debris1Default: function() {
        return {
            id: "debris/1/default",
            name: "debris1"            
        };
    },
    
    debris1: function(index, startTime, endTime, message) {
        return {
            id: "debris/1/" + index,
            name: "debris1",
            availability: [utility.getIntervalStr(startTime, endTime)],
            parent: "debris/1/default",
            billboard: {
                image: "/images/landsat8-icon.png",
                scale: 1.0,
                show: true
            },
            label: createLabel("Debris", message),
        };            
    }
};
