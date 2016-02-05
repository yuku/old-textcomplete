import Completer from '../src/completer';
import Query from '../src/query';
import Strategy from '../src/strategy';
import {NO_RESULT} from '../src/textcomplete';
import {createStrategy} from './test-helper';

const assert = require('power-assert');

describe('Completer', function () {
  beforeEach(function () {
    this.completer = new Completer();
  });

  describe('#strategies', function () {
    it('should be an Array', function () {
      assert.ok(this.completer.strategies instanceof Array);
    });
  });

  describe('#registerStrategy', function () {
    it('should return itself', function () {
      var strategy = new Strategy();
      assert.strictEqual(this.completer.registerStrategy(strategy), this.completer);
    });

    it('should append the given strategy to #strategies', function () {
      var strategy = new Strategy();
      var prev = this.completer.strategies.length;
      this.completer.registerStrategy(strategy);
      var curr = this.completer.strategies.length;
      assert.equal(curr, prev + 1);
      var lastStrategy = this.completer.strategies[this.completer.strategies.length - 1];
      assert.strictEqual(lastStrategy, strategy);
    });
  });

  describe('#execute', function () {
    var text = '';

    context('when a query is extracted', function () {
      beforeEach(function () {
        this.completer = new Completer();
        this.query = new Query();
        this.sinon.stub(this.completer, 'extractQuery', () => { return this.query; });
      });

      it('should call #execute to the query', function () {
        function callback() {}
        var stub = this.sinon.stub(this.query, 'execute');
        this.completer.execute(text, callback);
        assert(stub.calledOnce);
        assert(stub.calledWith(callback));
      });
    });

    context('when a query is not extracted', function () {
      beforeEach(function () {
        this.completer = new Completer();
        this.sinon.stub(this.completer, 'extractQuery', () => { return null; });
      });

      it('should callback with NO_RESULT and an empty array', function () {
        var spy = this.sinon.spy();
        this.completer.execute(text, spy);
        assert(spy.calledOnce);
        assert(spy.calledWith(NO_RESULT, []));
      });
    });
  });

  describe('#extractQuery', function () {
    context('when there is a appropreate strategy', function () {
      it('should return a Query', function () {
        var completer = new Completer();
        completer.registerStrategy(createStrategy({ match: /(he)(llo)$/ }));
        assert(completer.extractQuery('hello') instanceof Query);
      });
    });

    context('when there is not an appropreate strategy', function () {
      it('should return null', function () {
        var completer = new Completer();
        assert(completer.extractQuery('hello') === null);
      });
    });
  });
});
