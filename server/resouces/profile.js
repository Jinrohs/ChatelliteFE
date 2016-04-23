var getIntervalStr = function(startTime, endTime) {
    var startTimeStr = toTimeStringFormat(startTime);
    var endTimeStr = toTimeStringFormat(endTime);
    return startTimeStr + "/" + endTimeStr;
}

var toTimeStringFormat = function(dateobj) {
    return (dateobj.getYear() + 1900) + "-" + 
        toDoubleDegitsStr(dateobj.getMonth() + 1) + "-" + 
        toDoubleDegitsStr(dateobj.getDate()) + "T" +
        toDoubleDegitsStr(dateobj.getHours()) + ":" +
        toDoubleDegitsStr(dateobj.getMinutes()) + ":" +
        toDoubleDegitsStr(dateobj.getSeconds()) + "Z";
};

var toDoubleDegitsStr = function(val) {
    return val >= 10 ? String(val) : '0' + String(val);
}

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
                interval: getIntervalStr(startTime, endTime),
                currentTime: startTimeStr,
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
            availability: [getIntervalStr(startTime, endTime)],
            billboard: {
                image: "/images/hatsunemiku.jpg",
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
            availability: [getIntervalStr(startTime, endTime)],
            billboard: {
                image: "/images/hatsunemiku.jpg",
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
            availability: [getIntervalStr(startTime, endTime)],
            billboard: {
                image: "/images/hatsunemiku.jpg",
                scale: 1.0,
                show: true
            },
            label: createLabel("LandSat8", message)
        };
    }
};