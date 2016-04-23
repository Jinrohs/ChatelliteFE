/**
 * @brief CZMLを生成しレスポンスするコントローラです。
 */

var fs = require('fs');
var http = require('http');
var configure = require('../configure');

/**
 * 初回のCZMLをレスポンスします。
 */
var renderDefault = function(req, res) {
    fs.readFile(`${__dirname}/../public/default.czml`, 'UTF-8', function(err, data) {
        res.json(JSON.parse(data));
    });
};

/**
 * APIから軌道などを取得します。 
 * @param startTime 取得開始日時
 * @param endTime 取得終了日時
 * @param callback コールバック関数
 */
var loadOrbit = function(startTime, endTime, callback) {
};

var getOrbitApiUrl = function() {
    
};

module.exports = {
    handler: function(req, res) {
        var command = req.params.command;
        var option = req.params.option;
        console.log("command:" + command);
        console.log("option:" + option);
        
        if(command === 'default') {
            renderDefault(req, res);
        }
        
        
    }
}; 