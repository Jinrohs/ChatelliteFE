'use strict';
var assert = require('assert');
var rewire = require('rewire');
var profile = rewire('./profile');

describe('profile-test', function() {
    describe('toTimeStringFormat', function() {
        it('正常化系テスト', function() {
            var toTimeStringFormat = profile.__get__('toTimeStringFormat'); 
            var date = new Date(2016, 0, 1, 5, 15, 20);
            var actual = toTimeStringFormat(date);
            var expect = "2016-01-01T05:15:20Z";
            assert.equal(expect, actual);
        })
    });
    
    describe('createLabel', function() {
        it('名前だけ', function() {
            var createLabel = profile.__get__('createLabel');             
            var actual = createLabel('なまえ');
            assert.equal(actual.text, 'なまえ');
        });
        it('メッセージ有り', function() {
            var createLabel = profile.__get__('createLabel');             
            var actual = createLabel('なまえ', 'メッセージ');
            assert.equal(actual.text, 'なまえ 「メッセージ」');
        });        
    });
});