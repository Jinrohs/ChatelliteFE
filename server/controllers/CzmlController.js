/**
 * @brief CZMLを生成しレスポンスするコントローラです。
 */

var fs = require('fs');

var renderDefault = function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    fs.readFile(`${__dirname}/../public/default.czml`, 'UTF-8', function(err, data) {
        res.write(JSON.stringify(data));
        res.end();
    });
};

module.exports = {
    handler: function(req, res) {
        var command = req.params.command;
        var option = req.params.option;
        
        if(command == 'default') {
            renderDefault(req, res);
        }
    }
}; 