'use strict';

const reamingTimeForReload = 0.1;
const timeInterval = 7200;

var viewer;
var previousStopTime;

var onTickListener = function(clock) {
    if(isNextLoad(clock)) {
        loadNextOrbit(clock);
    }
    console.log(Math.round(Cesium.JulianDate.toDate(clock.currentTime).getTime() / 1000));
};

var isNextLoad = function(clock) {
    if(previousStopTime == undefined) {
        return true;
    }
    var reaming = Cesium.JulianDate.secondsDifference(clock.stopTime, clock.currentTime);
    return reaming <= reamingTimeForReload;
    //return false;
}

var loadNextOrbit = function(clock) {
    if(previousStopTime == undefined) {
        //viewer.dataSources.add(Cesium.CzmlDataSource.load('/api/czml/default'));
    }
    var timeRange = getNextTimeRange(clock);
    previousStopTime = timeRange.stopTime;
    var api = getApiUrl(timeRange);
    console.log("loading..: " + api);
    viewer.dataSources.add(Cesium.CzmlDataSource.load(api));
};

var getNextTimeRange = function(clock) {
    var startTime = Math.round(new Date().getTime() / 1000);
    if (previousStopTime != undefined) {
        console.log('update');
        startTime = previousStopTime;
        //startTime = Math.round(Cesium.JulianDate.toDate(clock.stopTime).getTime() / 1000);
        //startTime = Math.round(Cesium.JulianDate.toDate(clock.currentTime).getTime() / 1000);
    }
    var stopTime = Math.round(new Date((startTime + timeInterval) * 1000).getTime() / 1000);
    return {"startTime": startTime, "stopTime": stopTime};
};

var getApiUrl = function(timeRange) {
    return '/api/czml/get/' + timeRange.startTime + "-" + timeRange.stopTime;
}

var getCurrentDateTime = function() {
    return new Date();
};

module.exports = function () {
    viewer = new Cesium.Viewer('cesium-container', {
        // timeline: false,
        navigationHelpButton: false,
        infoBox: false,
        // homeButton: false,
        geocoder: false,
        animation: false,
        navigationInstructionsInitiallyVisible: false,
        baseLayerPicker : false
    });
    if(!viewer.baseLayerPicker) {
        var blackMarble = viewer.imageryLayers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
            url: 'https://cesiumjs.org/blackmarble',
            credit: 'Black Marble imagery courtesy NASA Earth Observatory',
            flipXY: true
        }));
        blackMarble.alpha = 1.0;
        blackMarble.brightness = 1.0;
    }
    viewer.clock.clockRange =  Cesium.ClockRange.LOOP_STOP;
    viewer.dataSources.add(Cesium.CzmlDataSource.load('/api/czml/default'));
    viewer.clock.onTick.addEventListener(onTickListener);
    //viewer.dataSources.add(Cesium.CzmlDataSource.load('/default.czml'));
    //viewer.dataSources.add(Cesium.CzmlDataSource.load('/default2.czml'));
    //viewer.dataSources.add(Cesium.CzmlDataSource.load('/default3.czml'));

    // 衛星のクリックイベント
    // var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    //
    // handler.setInputAction(function(event) {
    //     var pickedObject = viewer.scene.pick(event.position);
    //
    //     if (Cesium.defined(pickedObject)) {
    //         console.log(pickedObject.id.name);
    //         // ここでpopupの中身を書き換える
    //         $('#popup').removeClass('hide');
    //     }
    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
