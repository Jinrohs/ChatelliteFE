'use strict';
var assert = require('assert');
var rewire = require('rewire');
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
});