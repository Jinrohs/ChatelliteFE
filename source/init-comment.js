'use strict';

var satelliteData = require('./satellite-data');
var commentCount = 0;
var commentMarginBottom = 8;
var $commentTemplate = $('.comment');
var commentHeight = $commentTemplate.height();

function sortComments() {
    $('#comments-content .comment').each(function (index) {
        $(this)
            .css({
                top: index * (commentHeight + 8)
            });
    });
}

function addComment(name, comment) {
    var $comment = $commentTemplate.clone();

    $comment
        .css({
            top: commentCount * (commentHeight + commentMarginBottom) + commentHeight / 2
        })
        .appendTo('#comments-content')
        .removeClass('hide')
        .addClass('' + comment.id)
        .animate({
            top: commentCount * (commentHeight + commentMarginBottom)
        }, 200);

    $comment.find('.comment-message')
        .text(comment.message);

    $comment.find('.comment-title')
        .text(satelliteData[name].name);

    $comment.find('.comment-icon')
        .attr('src', satelliteData[name].chatIconSrc);

    commentCount++;
    sortComments();

    // 削除イベントをバインド
    setTimeout(function () {
        removeComment(comment.id);
    }, 10000);
}

function removeComment(commentId) {
    $('#comments-content .comment.' + commentId).remove();

    commentCount--;
    sortComments();
}

var autoAdd = function (satelliteName, viewerCurrentTime) {
    setTimeout(function () {
        console.log('comment fired.');

        if (commentCount > 6) {
            autoAdd(satelliteName);
            return;
        }

        var id = satelliteData[satelliteName].id;
        var date = Cesium.JulianDate.toDate(viewerCurrentTime);
        var timezoneOffset = date.getTimezoneOffset() * 60;
        var currentTime = Math.round(date.getTime() / 1000) + timezoneOffset;
        var url = '/api/speech/' + id + '/' + currentTime;

        $.get(url)
            .done(function (commentData) {
                console.log('comment done');
                addComment(satelliteName, commentData.result[0]);
            })
            .fail(function (error) {
                console.log(error);
            })
            .always(function () {
                autoAdd(satelliteName);
            });
    }, _.random(3, 15) * 1000);
};

module.exports = function (viewer) {
    autoAdd('hinode', viewer.clock.currentTime);
    autoAdd('ibuki', viewer.clock.currentTime);
    autoAdd('landsat8', viewer.clock.currentTime);
};
