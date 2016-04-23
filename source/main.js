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

// ふみくんメモ
// 210.129.18.214:30000/?id=33491&timestamp=10
//
function comment() {
    var comments = [];
    var $commentTemplate = $('.comment');
    var commentHeight = $commentTemplate.height();

    // _.times(4, function (index) {
    //     addComment(0, index);
    // });

    function removeFirstComment() {
        if (!comments.length) {
            return;
        }

        comments.pop();

        $('#comments-content .comment:first-child').remove();

        $('#comments-content .comment').each(function (index) {
            $(this)
                .css({
                    top: index * (commentHeight + 10)
                });
        });
    }

    function addComment(comment) {
        var $comment = $commentTemplate.clone();
        var commentConut = comments.length;

        $comment
            .css({
                top: commentConut * (commentHeight + 10) + commentHeight / 2
            })
            .appendTo('#comments-content')
            .removeClass('hide')
            .animate({
                top: commentConut * (commentHeight + 10)
            }, 200);

        $comment.find('p')
            .text(comment);

        comments.push(comment);
    }

    // var updateComment = function () {
    //     setTimeout(function () {
    //         removeFirstComment();
    //
    //         // setTimeout(function () {
    //         //     addComment(0, comments.length);
    //         // }, 2000);
    //
    //         var params = {
    //             id: 33491,
    //             timestamp: Date.now()
    //         };
    //
    //         $.get('http://210.129.18.214:30000', params, function (data) {
    //             addComment(data.result[0].comment, comments.length);
    //         });
    //     }, 3000);
    // };

    var autoAdd = function () {
        setTimeout(function () {
            if (comments.length > 6) {
                autoAdd();
                return;
            }

            var params = {
                id: 33491,
                timestamp: Date.now()
            };
            $.get('http://210.129.18.214:30000', params, function (data) {
                addComment(data.result[0].comment, comments.length);
                autoAdd();
            });
        }, _.random(1, 4) * 1000);
    };

    autoAdd();

    var autoRemove = function () {
        setTimeout(function () {
            if (comments.length > 2) {
                setTimeout(removeFirstComment, 300);
            }
            autoRemove();
        }, _.random(1, 6) * 1000);
    };

    autoRemove();
}
