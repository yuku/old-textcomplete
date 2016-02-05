import Query from '../src/query';
import {STILL_SEARCHING, SEARCH_COMPLETED} from '../src/textcomplete';

import {createStrategy} from './test-helper';

const assert = require('power-assert');
const sinon = require('sinon');

describe('Query', function () {
  describe('#execute', function () {
    it("should call strategy's search func once", function () {
      var spy = sinon.spy();
      var strategy = createStrategy({ search: spy });
      var term = 'foo';
      var match = [term, '', term];
      var query = new Query(strategy, term, match);
      query.execute(function () {});
      assert(spy.calledOnce);
      assert(spy.calledWith(term, sinon.match.func, match));
    });

    context('when search func callbacks with falsy second argument', function () {
      beforeEach(function () {
        this.strategy = createStrategy({
          search: function (term, callback) { callback([term], false); },
        });
      });

      it('should callback with SEARCH_COMPLETED and an array', function () {
        var spy = sinon.spy();
        var term = 'bar';
        var match = [term, '', term];
        var query = new Query(this.strategy, term, match);
        query.execute(spy);
        assert(spy.calledOnce);
        assert(spy.calledWith(SEARCH_COMPLETED, sinon.match.array));
      });
    });

    context('when search func callbacks with truthy second argument', function () {
      beforeEach(function () {
        this.strategy = createStrategy({
          search: function (term, callback) { callback([term], true); },
        });
      });

      it('should callback with SEARCH_COMPLETED and an array', function () {
        var spy = sinon.spy();
        var term = 'baz';
        var match = [term, '', term];
        var query = new Query(this.strategy, term, match);
        query.execute(spy);
        assert(spy.calledOnce);
        assert(spy.calledWith(STILL_SEARCHING, sinon.match.array));
      });
    });
  });
});
