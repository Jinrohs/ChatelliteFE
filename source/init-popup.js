var satelliteData = require('./satellite-data');

module.exports = function initPopup(viewer) {
    var $popup = $('#popup');

    $popup.on('click', function () {
        $popup.addClass('hide');
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
            }

            $popup.find('#popup-inner')
                .css({
                    marginTop: 15,
                    opacity: 0
                });

            $popup
                .removeClass('hide');

            $popup.find('#popup-inner')
                .animate({
                    marginTop: 0,
                    opacity: 1
                }, 400);

        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};
