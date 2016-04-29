'use strict';

var reamingTimeForReload = 0.1;
var timeInterval = 7200;
var previousStopTime = null;

var onTickListener = function(clock) {
    if(isNextLoad(clock)) {
        loadNextOrbit(clock);
    }
};

var isNextLoad = function(clock) {
    if(previousStopTime === null) {
        return true;
    }
    var reaming = Cesium.JulianDate.secondsDifference(clock.stopTime, clock.currentTime);
    return reaming <= reamingTimeForReload;
    //return false;
}

var loadNextOrbit = function(clock) {
    var timeRange = getNextTimeRange(clock);
    previousStopTime = timeRange.stopTime;

    var api = getApiUrl(timeRange);
    console.log("loading..: " + api);
    viewer.dataSources.add(Cesium.CzmlDataSource.load(api));
};

var getNextTimeRange = function(clock) {
    var startTime = Math.round(new Date.now() / 1000);
    if (previousStopTime !== null) {
        console.log('update');
        startTime = previousStopTime;
    }
    var stopTime = Math.round(new Date((startTime + timeInterval) * 1000).getTime() / 1000);

    return {
        startTime: startTime,
        stopTime: stopTime
    };
};

var getApiUrl = function(timeRange) {
    return '/api/czml/get/' + timeRange.startTime + "-" + timeRange.stopTime;
}

module.exports = function () {
    var viewer = new Cesium.Viewer('cesium-container', {
        // timeline: false,
        // homeButton: false,
        navigationHelpButton: false,
        infoBox: false,
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
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.dataSources.add(Cesium.CzmlDataSource.load('/api/czml/default'));
    viewer.clock.onTick.addEventListener(onTickListener);

    return viewer;
};
