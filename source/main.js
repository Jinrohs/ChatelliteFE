'use strict';

var initCesiumViewer = require('./init-cesium-viewer');
var initPopup = require('./init-popup');
var initSplash = require('./init-splash');
var initComment = require('./init-comment');

$(document).ready(function() {
    initCesiumViewer();
    initPopup();
    initSplash(initComment);
    // initComment();
});
