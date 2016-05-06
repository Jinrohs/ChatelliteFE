'use strict';

var reamingTimeForReload = 0.1;
var timeInterval = 7200;
var previousStopTime = null;

function onTickListener(viewer, clock) {
    if(isNextLoad(clock)) {
        loadNextOrbit(viewer, clock);
    }
}

function isNextLoad(clock) {
    if(previousStopTime === null) {
        return true;
    }
    var reaming = Cesium.JulianDate.secondsDifference(clock.stopTime, clock.currentTime);
    return reaming <= reamingTimeForReload;
}

function loadNextOrbit(viewer, clock) {
    var timeRange = getNextTimeRange(clock);
    previousStopTime = timeRange.stopTime;

    var api = getApiUrl(timeRange);
    console.log("loading..: " + api);
    viewer.dataSources.add(Cesium.CzmlDataSource.load(api));
}

function getNextTimeRange(clock) {
    var startTime = Math.round(Date.now() / 1000);
    if (previousStopTime !== null) {
        console.log('update');
        startTime = previousStopTime;
    }
    var stopTime = Math.round(new Date((startTime + timeInterval) * 1000).getTime() / 1000);

    return {
        startTime: startTime,
        stopTime: stopTime
    };
}

function getApiUrl(timeRange) {
    return '/api/czml/' + timeRange.startTime + "-" + timeRange.stopTime;
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
    //viewer.dataSources.add(Cesium.CzmlDataSource.load('/api/czml/default'));
    viewer.clock.onTick.addEventListener(function (clock) {
        onTickListener(viewer, clock);
    });

    return viewer;
};
