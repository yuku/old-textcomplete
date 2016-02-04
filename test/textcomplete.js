import Textcomplete from '../src/textcomplete';

const assert = require('power-assert');

import {getTextarea} from './test-helper';

describe('Textcomplete', function () {
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
