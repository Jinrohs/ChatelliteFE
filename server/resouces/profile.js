var utility = require('../utility');

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
                20,0
            ]
        },
        show: true,
        style: "FILL_AND_OUTLINE",
        verticalOrigin: "CENTER"
    };         
};

module.exports = {
    document: function(startTime, endTime) {
        return {
            id: "document",
            name: "satecolle",
            version: "1.0",
            clock :{
                interval: utility.getIntervalStr(startTime, endTime),
                currentTime: utility.toTimeStringFormat(startTime),
                multiplier: 60,
                range: "LOOP_STOP",
                step: "SYSTEM_CLOCK_MULTIPLIER"
            }
        };
    },
    
    hinode: function(index, startTime, endTime, message) {        
        return {
            id: "satellite/hinode/" + index,
            name: "hinode",
            availability: [utility.getIntervalStr(startTime, endTime)],
            billboard: {
                image: "/images/hatsunemiku.png",
                scale: 1.0,
                show: true
            },
            label: createLabel("ひので", message)
        };
    },
    
    ibuki: function(index, startTime, endTime, message) {
        return {
            id: "satellite/ibuki/" + index,
            name: "hinode",
            availability: [utility.getIntervalStr(startTime, endTime)],
            billboard: {
                image: "/images/hatsunemiku.png",
                scale: 1.0,
                show: true
            },
            label: createLabel("いぶき", message)
        };
    },
    
    landsat8: function(index, startTime, endTime, message) {
        return {
            id: "satellite/landsat8/" + index,
            name: "hinode",
            availability: [utility.getIntervalStr(startTime, endTime)],
            billboard: {
                image: "/images/hatsunemiku.png",
                scale: 1.0,
                show: true
            },
            label: createLabel("LandSat8", message)
        };
    }
};