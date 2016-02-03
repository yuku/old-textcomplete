import Textcomplete from '../src/textcomplete';
import Completer from '../src/completer';

const assert = require('power-assert');

describe('Textcomplete', function () {
  describe('#completer', function () {
    it('should be a Completer', function () {
      var textcomplete = new Textcomplete();
      assert.ok(textcomplete.completer instanceof Completer);
    });
  });

  describe('#register', function () {
    it('should return itself', function () {
      var textcomplete = new Textcomplete();
      assert.strictEqual(textcomplete.register([{}]), textcomplete);
    });

    it('should call Completer#registerStrategy', function () {
      // TODO use spy object
    });
  });
});
