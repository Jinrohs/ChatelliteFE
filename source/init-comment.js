'use strict';

var satelliteData = require('./satellite-data');
var comments = {};
var commentCount = 0;

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

// function removeFirstComment() {
//     if (!comments.length) {
//         return;
//     }
//
//     // comments.pop();
//     commentCount--;
//
//     $('#comments-content .comment:first-child').remove();
//
//     sortComments();
// }

function addComment(name, comment) {
    var $comment = $commentTemplate.clone();
    // var commentConut = commentCount;

    $comment
        .css({
            top: commentConut * (commentHeight + 8) + commentHeight / 2
        })
        .appendTo('#comments-content')
        .removeClass('hide')
        .addClass(comment.id)
        .animate({
            top: commentConut * (commentHeight + 8)
        }, 200);

    $comment.find('.comment-message')
        .text(comment.message);

    $comment.find('.comment-title')
        .text(satelliteData[name].name);

    $comment.find('.comment-icon')
        .attr('src', satelliteData[name].chatIconSrc);

    // comments[comment.id](comment);
    commentCount++;

    setTimeout(function () {
        $('#comments-content .comment.' + comment.id).remove();
        commentCount++;
    }, 3000);

    sortComments();
}

var autoAdd = function (name) {
    setTimeout(function () {
        console.log('comment fired');

        if (commentCount > 6) {
            autoAdd();
            return;
        }

        var params = {
            id: satelliteData[name].id,
            timestamp: Math.round(Date.now()/1000)
        };

        $.get('http://210.129.18.214:30000', params)
            .done(function (commentData) {
                addComment(name, commentData.result[0]);
            })
            .fail(function (error) {
                console.log(error);
            })
            .always(function () {
                autoAdd(name);
            });

    }, _.random(5, 20) * 1000);
};

var autoRemove = function () {
    setTimeout(function () {
        if (commentCount > 2) {
            setTimeout(removeFirstComment, 300);
        }
        autoRemove();
    }, _.random(1, 6) * 1000);
};

module.exports = function (viewer) {
    autoAdd('hinode');
    autoAdd('ibuki');
    autoAdd('landsat8');
    // autoRemove();
}
