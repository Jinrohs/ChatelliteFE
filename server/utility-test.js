'use strict';
var assert = require('assert');
var rewire = require('rewire');
var utility = rewire('./utility');

describe('profile-test', function() {
    describe('toTimeStringFormat', function() {
        it('正常化系テスト', function() {
            var date = new Date(2016, 0, 1, 5, 15, 20);
            var actual = utility.toTimeStringFormat(date);
            var expect = "2016-01-01T05:15:20Z";
            assert.equal(expect, actual);
        })
    });    
});