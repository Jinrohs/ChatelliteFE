'use strict';

$(document).ready(function() {
    cesiumViewer();
    popup();
    splash();
    comment();
});

// Cesiumのセットアップ
function cesiumViewer() {
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
    var data = Cesium.CzmlDataSource.load('/api/czml/get/1396324800-1396325700');
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

    return $logo
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

function comment() {
    var comments = [];
    var $commentTemplate = $('.comment');

    // $comment.removeClass('hide');
    var commentHeight = $commentTemplate.height();

    _.times(4, function (index) {
        addComment(0, index);
    });

    function removeFirstComment() {
        $('#comments-content .comment:first-child').remove();

        $('#comments-content .comment').each(function (index) {
            $(this)
            .css({
                top: index * (commentHeight + 10)
            });
        });

        comments.pop();
    }

    function addComment(comment) {
        var $comment = $commentTemplate.clone();

        $comment
            .css({
                top: comments.length * (commentHeight + 10) + commentHeight / 2
            })
            .appendTo('#comments-content')
            .removeClass('hide')
            .animate({
                top: comments.length * (commentHeight + 10)
            }, 200);

        comments.push(comment);
    }

    var updateComment = function () {
        setTimeout(function () {
            removeFirstComment();

            setTimeout(function () {
                addComment(0, comments.length);
            }, 2000);
        }, 3000);
    };

    setInterval(function () {
        updateComment();
    }, 5000);
}
