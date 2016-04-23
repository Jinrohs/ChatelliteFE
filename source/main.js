'use strict';

var viewer = new Cesium.Viewer('cesiumContainer', {
    fullscreenElement: 'previewContent'
});

var move = function() {
    var camera = viewer.camera;
    var positionCartographic = camera.positionCartographic;
    var height = positionCartographic.height;
    var lat = positionCartographic.latitude + Cesium.Math.toRadians(2.0);
    var lon = positionCartographic.longitude + Cesium.Math.toRadians(20.0);
    camera.flyTo({
        destination: Cesium.Cartesian3.fromRadians(lon, lat, height),
        duration: 1.0
    });
};

showSource('cesiumSource', move);
