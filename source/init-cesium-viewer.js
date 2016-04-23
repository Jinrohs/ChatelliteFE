'use strict';

module.exports = function () {
    var viewer = new Cesium.Viewer('cesium-container', {
        // timeline: false,
        navigationHelpButton: false,
        infoBox: false,
        // homeButton: false,
        geocoder: false,
        //animation: false,
        navigationInstructionsInitiallyVisible: false,
        baseLayerPicker : false
    });

    var blackMarble = viewer.imageryLayers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
        url: 'https://cesiumjs.org/blackmarble',
        credit: 'Black Marble imagery courtesy NASA Earth Observatory',
        flipXY: true
    }));
    blackMarble.alpha = 1.0;
    blackMarble.brightness = 1.0;

    // データ追加
    var startTime = Math.round(new Date(2015,10, 1,12,0,0).getTime() / 1000);
    var endTime = Math.round(new Date(startTime * 1000 + (3600 * 1000)).getTime() / 1000);
    var api = '/api/czml/get/' + startTime + "-" + endTime;
    var data = Cesium.CzmlDataSource.load(api);
    viewer.dataSources.add(data);

    // 衛星のクリックイベント
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction(function(event) {
        var pickedObject = viewer.scene.pick(event.position);

        if (Cesium.defined(pickedObject)) {
            console.log(pickedObject.id.name);
            // ここでpopupの中身を書き換える
            $('#popup').removeClass('hide');
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
