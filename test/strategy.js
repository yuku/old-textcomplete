import Strategy from '../src/strategy';
import Query from '../src/query';

const assert = require('power-assert');

describe('Strategy', function () {
  describe('#strategy', function () {
    it('should be an object', function () {
      var object = {};
      var strategy = new Strategy(object);
      assert.strictEqual(strategy.strategy, object);
    });
  });

  describe('#buildQuery()', function () {
    function sharedExamples() {
      context("and given text matches to the function's result", function () {
        it('should return a Query object', function () {
          var result = this.strategy.buildQuery('@hello');
          assert.ok(result instanceof Query);
          assert.strictEqual(result.strategy, this.strategy);
          assert.strictEqual(result.term, 'hello');
          assert.ok(Array.isArray(result.match));
        });
      });

      context("and given text does not match to the function's result", function () {
        it('should return null', function () {
          assert.equal(this.strategy.buildQuery('hello'), null);
        });
      });
    }

    context('when match param is a function' , function () {
      beforeEach(function () {
        var object = {
          match: function () { return /(^|\s)@(\w+)$/; },
        };
        this.strategy = new Strategy(object);
      });

      sharedExamples.call(this);
    });

    context('when match param is a regexp', function () {
      beforeEach(function () {
        var object = {
          match: /(^|\s)@(\w+)$/,
        };
        this.strategy = new Strategy(object);
      });

      sharedExamples.call(this);
    });
  });
});
