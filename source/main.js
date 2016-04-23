'use strict';

$(document).ready(function() {
    var viewer = new Cesium.Viewer('cesiumContainer');
    var data = Cesium.CzmlDataSource.load('/api/czml/default');
    //var data = Cesium.CzmlDataSource.load('/default.czml');    
    console.log(data);
    viewer.dataSources.add(data);
});