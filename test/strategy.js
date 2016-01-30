import Strategy from '../src/strategy';

var assert = require('power-assert');

describe('Strategy', () => {
  describe('#strategy', () => {
    it('should be an object', () => {
      var object = {};
      var strategy = new Strategy(object);
      assert(strategy.strategy === object);
    });
  });
});
