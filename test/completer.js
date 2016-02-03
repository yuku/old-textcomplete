import Completer from '../src/completer';
import Strategy from '../src/strategy';

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
});
