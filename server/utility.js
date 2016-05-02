module.exports.getIntervalStr = function(startTime, endTime) {
    var startTimeStr = this.toTimeStringFormat(startTime);
    var endTimeStr = this.toTimeStringFormat(endTime);
    return startTimeStr + "/" + endTimeStr;
}

module.exports.toTimeStringFormat = function(dateobj) {
    var utc = dateobj.getU
    return dateobj.getUTCFullYear() + "-" + 
        toDoubleDegitsStr(dateobj.getUTCMonth() + 1) + "-" + 
        toDoubleDegitsStr(dateobj.getUTCDate()) + "T" +
        toDoubleDegitsStr(dateobj.getUTCHours()) + ":" +
        toDoubleDegitsStr(dateobj.getUTCMinutes()) + ":" +
        toDoubleDegitsStr(dateobj.getUTCSeconds()) + "Z";
};

var toDoubleDegitsStr = function(val) {
    return val >= 10 ? String(val) : '0' + String(val);
}