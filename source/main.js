'use strict';

$(document).ready(function() {
    var viewer = new Cesium.Viewer('cesiumContainer', {
        timeline: false,
        navigationHelpButton: false,
        infoBox: false,
        // homeButton: false,
        geocoder: false,
        animation: false,
        navigationInstructionsInitiallyVisible: false,

        imageryProvider : new Cesium.ArcGisMapServerImageryProvider({
            url : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        }),
        baseLayerPicker : false
    });

    var blackMarble = viewer.imageryLayers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
        url: 'https://cesiumjs.org/blackmarble',
        credit: 'Black Marble imagery courtesy NASA Earth Observatory',
        flipXY: true
    }));
    blackMarble.alpha = 0.9;
    blackMarble.brightness = 2.0;

    // データ追加
    var data = Cesium.CzmlDataSource.load('/api/czml/default');
    viewer.dataSources.add(data);

    // 衛星のクリックイベント
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction(function(event) {
        console.log(event);

        var pickedObject = viewer.scene.pick(event.position);

        if (Cesium.defined(pickedObject)) {
            console.log(pickedObject);
            $('#popup').removeClass('hide');
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


    // ポップアップ背景のクリックイベント
    $('#popup').on('click', function (event) {
        $(event.target).addClass('hide');
    });
});
