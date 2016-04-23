/**
 * @brief CZMLを生成しレスポンスするコントローラです。
 */

var fs = require('fs');

var renderDefault = function(req, res) {
    fs.readFile(`${__dirname}/../public/default.czml`, 'UTF-8', function(err, data) {
        res.json(JSON.parse(data));
    });
};

module.exports = {
    handler: function(req, res) {
        var command = req.params.command;
        var option = req.params.option;
        console.log("cmd:" + command);
        if(command === 'default') {
            renderDefault(req, res);
        }
    }
}; 