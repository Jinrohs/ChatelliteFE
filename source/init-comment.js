'use strict';

var comments = [];
var $commentTemplate = $('.comment');
var commentHeight = $commentTemplate.height();

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

var autoAdd = function () {
    setTimeout(function () {
        console.log('fefefefef');

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


var autoRemove = function () {
    setTimeout(function () {
        if (comments.length > 2) {
            setTimeout(removeFirstComment, 300);
        }
        autoRemove();
    }, _.random(1, 6) * 1000);
};


module.exports =function () {
    autoAdd();
    autoRemove();
}
