'use strict';

var satelliteData = require('./satellite-data');
var commentCount = 0;
var commentMarginBottom = 8;
var $commentTemplate = $('.comment');
var commentHeight = $commentTemplate.height();
var viewer;

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
        console.log(comment);
        commentCount--;
        $('#comments-content .comment.' + comment.id).remove();
        sortComments();
    }, 10000);
}

var autoAdd = function (name) {
    var func = function() {
        console.log('comment fired');

        if (commentCount > 6) {
            autoAdd(name);
            return;
        }

        var id = satelliteData[name].id;

        var date = Cesium.JulianDate.toDate(viewer.clock.currentTime);
        var timezoneOffset = date.getTimezoneOffset() * 60;
        var currentTime = Math.round(date.getTime() / 1000) + timezoneOffset;

        var url = '/api/speech/' + id + '/' + currentTime;     
        $.get(url)
            .done(function (commentData) {
                console.log('comment done');
                addComment(name, commentData.result[0]);
            })
            .fail(function (error) {
                console.log(error);
            })
            .always(function () {
                //autoAdd(name);
                setTimeout(func, _.random(3, 15) * 1000);
            });
    };
    setTimeout(func,  _.random(1, 4) * 1000);
};

module.exports = function (_viewer) {
    viewer = _viewer;
    autoAdd('hinode');
    autoAdd('ibuki');
    autoAdd('landsat8');
}
