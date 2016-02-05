import Query from '../src/query';
import {STILL_SEARCHING, SEARCH_COMPLETED} from '../src/textcomplete';

import {createStrategy} from './test-helper';

const assert = require('power-assert');
const sinon = require('sinon');

describe('Query', function () {
  describe('#execute', function () {
    var term = 'hello';
    var match = [term, '', term];

    it("should call strategy's search func once", function () {
      var spy = sinon.spy();
      var strategy = createStrategy({ search: spy });
      var query = new Query(strategy, term, match);
      query.execute(function () {});
      assert(spy.calledOnce);
      assert(spy.calledWith(term, sinon.match.func, match));
    });

    function sharedExample(secondArg, state) {
      context(`when search func callbacks with ${secondArg} as second argument`, function () {
        beforeEach(function () {
          this.strategy = createStrategy({
            search: function (t, callback) { callback([t], secondArg); },
          });
        });

        it(`should callback with ${state} and an array`, function () {
          var spy = sinon.spy();
          var query = new Query(this.strategy, term, match);
          query.execute(spy);
          assert(spy.calledOnce);
          assert(spy.calledWith(state, sinon.match.array));
        });
      });
    }

    sharedExample.call(this, false, SEARCH_COMPLETED);
    sharedExample.call(this, true, STILL_SEARCHING);
  });
});
