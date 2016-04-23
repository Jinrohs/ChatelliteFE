'use strict';

$(document).ready(function() {
    var viewer = new Cesium.Viewer('cesiumContainer', {
        timeline: false,
        navigationHelpButton: false,
        infoBox: false,
        // homeButton: false,
        geocoder: false,
        //animation: false,
        navigationInstructionsInitiallyVisible: false,

        imageryProvider : new Cesium.ArcGisMapServerImageryProvider({
            url : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        }),
        baseLayerPicker : false
    });

    var layers = viewer.imageryLayers;

    var blackMarble = layers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
        url: 'https://cesiumjs.org/blackmarble',
        credit: 'Black Marble imagery courtesy NASA Earth Observatory',
        flipXY: true
    }));
    blackMarble.alpha = 0.9;
    blackMarble.brightness = 2.0;

    var data = Cesium.CzmlDataSource.load('/api/czml/default');
    viewer.dataSources.add(data);
    
    viewer.dataSources.add(Cesium.CzmlDataSource.load('/default2.czml'));
    viewer.dataSources.add(Cesium.CzmlDataSource.load('/default3.czml'));
    
});
