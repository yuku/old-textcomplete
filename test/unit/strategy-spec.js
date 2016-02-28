import Strategy from '../../src/strategy';
import Query from '../../src/query';

const assert = require('power-assert');

describe('Strategy', function () {
  describe('#props', function () {
    it('should be an object', function () {
      var object = {};
      var strategy = new Strategy(object);
      assert.strictEqual(strategy.props, object);
    });
  });

  describe('#buildQuery()', function () {
    var strategy;

    function sharedExamples() {
      context("and given text matches to the function's result", function () {
        it('should return a Query object', function () {
          var result = strategy.buildQuery('@hello');
          assert.ok(result instanceof Query);
          assert.strictEqual(result.strategy, strategy);
          assert.strictEqual(result.term, 'hello');
          assert.ok(Array.isArray(result.match));
        });
      });

      context("and given text does not match to the function's result", function () {
        it('should return null', function () {
          assert.equal(strategy.buildQuery('hello'), null);
        });
      });
    }

    context('when match param is a function' , function () {
      beforeEach(function () {
        strategy = new Strategy({ match: function () { return /(^|\s)@(\w+)$/; } });
      });

      sharedExamples();
    });

    context('when match param is a regexp', function () {
      beforeEach(function () {
        strategy = new Strategy({ match: /(^|\s)@(\w+)$/ });
      });

      sharedExamples();
    });
  });

  describe('#search()', function () {
    var strategy, term, callback, match, results, searchFunc;

    function subject() {
      strategy.search(term, callback, match);
    }

    beforeEach(function () {
      results = [];
      searchFunc = this.sinon.spy(function (_t, c) { c(results); });
    });

    context('with cache', function () {
      beforeEach(function () {
        strategy = new Strategy({ cache: true, search: searchFunc });
        [term, callback, match] = ['he', this.sinon.spy(), ['he', '', 'he']];
      });

      it('should cache the search results', function () {
        subject();
        assert(searchFunc.calledOnce);
        assert(callback.calledOnce);
        assert(callback.calledWith(results));

        searchFunc.reset();
        callback.reset();

        subject();
        assert(!searchFunc.called);
        assert(callback.calledOnce);
        assert(callback.calledWith(results));
      });
    });

    context('without cache', function () {
      beforeEach(function () {
        strategy = new Strategy({ cache: false, search: searchFunc });
        [term, callback, match] = ['he', this.sinon.spy(), ['he', '', 'he']];
      });

      it('should not cache the search results', function () {
        subject();
        assert(searchFunc.calledOnce);
        assert(callback.calledOnce);
        assert(callback.calledWith(results));

        searchFunc.reset();
        callback.reset();

        subject();
        assert(searchFunc.calledOnce);
        assert(callback.calledOnce);
        assert(callback.calledWith(results));
      });
    });
  });
});
