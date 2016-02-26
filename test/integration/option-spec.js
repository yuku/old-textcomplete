import Textcomplete from '../../src/textcomplete';
import Textarea from '../../src/textarea';
import {CLASS_NAME} from '../../src/dropdown-item';

const assert = require('power-assert');

describe('Options integration test', function () {
  var textareaEl, textarea;

  beforeEach(function () {
    textareaEl = document.createElement('textarea');
    document.body.appendChild(textareaEl);
    textarea = new Textarea(textareaEl);
  });

  describe('maxCount', function () {
    it('should truncate the items of dropdown', function () {
      var maxCount = 3;
      var textcomplete = new Textcomplete(textarea, { maxCount: maxCount });
      textcomplete.register([{
        match: /(\s|^)@(\w+)$/,
        search: function (term, callback) { callback([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]); },
        replace: function (value) { return value; },
      }]);

      textareaEl.value = '@a';
      textareaEl.selectionStart = textareaEl.selectionEnd = 2;
      var keyupEvent = document.createEvent('UIEvents');
      keyupEvent.initEvent('keyup', true, true);
      keyupEvent.keyCode = 50;
      textareaEl.dispatchEvent(keyupEvent);

      var items = document.getElementsByClassName(CLASS_NAME);
      assert.equal(items.length, maxCount);
    });
  });
});
