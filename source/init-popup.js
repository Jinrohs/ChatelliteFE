var satelliteData = require('./satellite-data');

module.exports = function initPopup(viewer) {
    var $popup = $('#popup');
    var $popupInner = $popup.find('#popup-inner');
    var $popupGallery = $('#popup-gallery');

    // ポップアップをクローズ
    $popup.find('.popup-close-button').on('click', function () {
        $popupInner
            .animate({
                marginTop: 15,
                opacity: 0
            }, 400, function () {
                $popupInner
                    .css({
                        marginTop: 0,
                        opacity: 1
                    });

                $popup.addClass('hide');
            });

        $popupGallery.children().remove();
    });

    // 衛星のクリックイベント
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function(event) {
        var pickedObject = viewer.scene.pick(event.position);

        if (Cesium.defined(pickedObject)) {
            console.log(pickedObject.id.name);

            var data = satelliteData[pickedObject.id.name];
            console.log(data);

            if (data) {
                $popup.find('#popup-title').text(data.name);
                $popup.find('.birthday').text(data.birthday);
                $popup.find('.country').text(data.country);
                $popup.find('.weight').text(data.weight);
                $popup.find('.message').text(data.message);
                $popup.find('.norad-id').text(data.id);
                $popup.find('.popup-image').attr('src', data.imageSrc);

                data.galleryImageSrcs.forEach(function (src) {
                    var $img = $('<img class="popup-gallery-image">').attr('src', src);
                    $img.appendTo($('#popup-gallery'));
                    // $img.appendTo($('#popup-gallery'));
                    // $img.appendTo($('#popup-gallery'));
                    // $popup.find('#popup-gallery').('src', data.imageSrc);
                });
            }

            $popupInner
                .css({
                    marginTop: 15,
                    opacity: 0
                });

            $popup
                .removeClass('hide');

            $popupInner
                .animate({
                    marginTop: 0,
                    opacity: 1
                }, 400);
        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};
