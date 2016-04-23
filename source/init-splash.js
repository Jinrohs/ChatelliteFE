module.exports = function initSplash(callback) {
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
        }, 1500, function () {
            setTimeout(function () {
                $splash.animate({ opacity: 0 }, 700, function () {
                    $splash.addClass('hide');
                    if (callback) {
                        callback();
                    }
                });
            }, 1000);
        });
};
