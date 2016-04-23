module.exports.getIntervalStr = function(startTime, endTime) {
    var startTimeStr = this.toTimeStringFormat(startTime);
    var endTimeStr = this.toTimeStringFormat(endTime);
    return startTimeStr + "/" + endTimeStr;
}

module.exports.toTimeStringFormat = function(dateobj) {
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