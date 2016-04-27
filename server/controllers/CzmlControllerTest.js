'use strict';
var assert = require('assert');
var rewire = require('rewire');
var configure = require('../configure');
var CzmlController = rewire('./CzmlController');

describe('CzmlController', function() {
    describe('parseRequestedTime', function() {
        it('正常化系テスト', function() {
            var expect1 = new Date(2016, 0, 1, 13, 15, 20);
            var expect2 = new Date(2016, 11, 15, 20, 15, 40);
            var parseRequestedTime = CzmlController.__get__('parseRequestedTime');
            var actual = parseRequestedTime("1451621720-1481800540");
            assert.equal(actual.startTime.getTime(), expect1.getTime());
            assert.equal(actual.endTime.getTime(), expect2.getTime());
        })
    });

    describe('getOrbitApiUrl', function() {
        it('URL取得', function() {
            var getOrbitApiUrl = CzmlController.__get__('getOrbitApiUrl');
            var startTime = new Date(2015, 1, 10, 11, 10, 0);
            var endTime = new Date(2015, 1, 10, 12, 10, 0);
            var actual = getOrbitApiUrl(startTime, endTime);
            var expect = "http://" + configure.orbitApi + ":"
                 + configure.orbitApiPort + "/xyz" +
                 "?start=1423534200&end=1423537800";
            assert.equal(actual, expect);
        });
    });

    describe('convertCatesianPosition', function() {
       it('positionの変換', function() {
           var convertCatesianPosition = CzmlController.__get__('convertCatesianPosition');
           var data = [
               [0, 1, 2, 3], [10, 1, 2, 3], [20, 1, 2, 3]
           ]
           var actual = convertCatesianPosition(data);
           var expect = [0, 1, 2, 3, 10, 1, 2, 3, 20, 1, 2, 3];
           assert.deepEqual(actual, expect);
       });
    });
    /*
    describe('createCzml', function() {
        it('', function() {
            var createCzml = CzmlController.__get__('createCzml');
            var cartesians = {
                "33492": [
                    [0, 10, 10, 10],
                    [100, 20, 20, 20],
                    [200, 30, 30, 30]
                ],
                "29479": [
                    [0, 100, 10, 100],
                    [100, 200, 20, 200],
                    [200, 300, 30, 300]
                ],
                "39084": [
                    [0, 100, 10, 100],
                    [100, 20, 200, 200],
                    [200, 30, 300, 300]
                ]
            };

            var startTime = new Date(2016, 2, 1, 12, 35, 40);
            var endTime = new Date(2016, 2, 2, 12, 35, 40);
            var actual = createCzml(cartesians, startTime, endTime);
            console.log(actual);
        });
    });*/
});
