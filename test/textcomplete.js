import Textcomplete from '../src/textcomplete';
import Completer from '../src/completer';

const assert = require('power-assert');

import {getTextarea} from './test-helper';

describe('Textcomplete', function () {
  describe('#completer', function () {
    it('should be a Completer', function () {
      var textcomplete = new Textcomplete(getTextarea());
      assert.ok(textcomplete.completer instanceof Completer);
    });
  });

  describe('#register', function () {
    it('should return itself', function () {
      var textcomplete = new Textcomplete(getTextarea());
      assert.strictEqual(textcomplete.register([{}]), textcomplete);
    });

    it('should call Completer#registerStrategy', function () {
      // TODO use spy object
    });
  });
});
