'use strict';

$(document).ready(function() {
    cesiumViewer();
    popup();
    splash();
});

// Cesiumのセットアップ
function cesiumViewer() {
    var viewer = new Cesium.Viewer('cesiumContainer', {
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
    viewer.dataSources.add(Cesium.CzmlDataSource.load('/api/czml/default'));
    viewer.dataSources.add(Cesium.CzmlDataSource.load('/default2.czml'));
    viewer.dataSources.add(Cesium.CzmlDataSource.load('/default3.czml'));

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
}

// ポップアップ背景のクリックイベント
function popup() {
    $('#popup').on('click', function (event) {
        $('#popup').addClass('hide');
    });
}

// スプラッシュ画面の処理
function splash() {
    var $splash = $('#splash');
    var $logo = $('#splash .logo');
    var logoPositionYCenter = $(window).height() / 2 - $logo.height() / 2;

    $logo
        .css({
            marginTop: logoPositionYCenter + 50
        })
        .animate({
            marginTop: logoPositionYCenter,
            opacity: 1
        }, 1000, function () {
            setTimeout(function () {
                $splash.animate({ opacity: 0 }, 700, function () {
                    $splash.addClass('hide');
                });
            }, 1000);
        });
}
