'use strict';

$(document).ready(function() {
    var blackmarbleImageryProvider = Cesium.createTileMapServiceImageryProvider({
        url : '//cesiumjs.org/tilesets/imconagery/blackmarble',
        minimumLevel : 0,
        maximumLevel : 8
    });

    var viewer = new Cesium.Viewer('cesiumContainer', {
        timeline: false,
        navigationHelpButton: false,
        infoBox: false,
        homeButton: false,
        geocoder: false,
        animation: false,
        navigationInstructionsInitiallyVisible: false,
    });

    var layers = viewer.scene.imageryLayers;

    // console.log(layers)
    // var blackMarble = layers.add(blackmarbleImageryProvider);
    // console.log(Cesium);

    var data = Cesium.CzmlDataSource.load('/api/czml/default');
    viewer.dataSources.add(data);
});
