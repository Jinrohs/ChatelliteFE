'use strict';
var assert = require('assert');
var rewire = require('rewire');
var profile = rewire('./profile');

describe('profile-test', function() {
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