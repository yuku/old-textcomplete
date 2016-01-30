import Strategy from '../src/strategy';

import {isArray} from 'lodash';

var assert = require('power-assert');

describe('Strategy', function () {
  describe('#strategy', function () {
    it('should be an object', function () {
      var object = {};
      var strategy = new Strategy(object);
      assert.strictEqual(strategy.strategy, object);
    });
  });

  describe('#test()', function () {
    context('when match param is a function' , function () {
      beforeEach(function () {
        var object = {
          match: function () { return /(^|\s)@(\w+)$/; },
        };
        this.strategy = new Strategy(object);
      });

      context("and given text matches to the function's result", function () {
        it('should return object with strategy, query and match', function () {
          var result = this.strategy.test('@hello');
          assert.strictEqual(result.strategy, this.strategy);
          assert.strictEqual(result.query, 'hello');
          assert.ok(isArray(result.match));
        });
      });

      context("and given text does not match to the function's result", function () {
        it('should return false', function () {
          assert.equal(this.strategy.test('hello'), false);
        });
      });
    });

    context('when match param is a regexp', function () {
      beforeEach(function () {
        var object = {
          match: /(^|\s)@(\w+)$/,
        };
        this.strategy = new Strategy(object);
      });

      context("and given text matches to the function's result", function () {
        it('should return object with strategy, query and match', function () {
          var result = this.strategy.test('@hello');
          assert.strictEqual(result.strategy, this.strategy);
          assert.strictEqual(result.query, 'hello');
          assert.ok(isArray(result.match));
        });
      });

      context("and given text does not match to the function's result", function () {
        it('should return false', function () {
          assert.equal(this.strategy.test('hello'), false);
        });
      });
    });
  });
});
