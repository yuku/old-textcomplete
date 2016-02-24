import Textcomplete from '../../src/textcomplete';
import Textarea from '../../src/textarea';

const assert = require('power-assert');

describe('Dropdown options integration test', function () {
  var textareaEl, textarea;

  beforeEach(function () {
    textareaEl = document.createElement('textarea');
    document.body.appendChild(textareaEl);
    textarea = new Textarea(textareaEl);
  });

  describe('className', function () {
    it('should be set as class attribute of dropdown element', function () {
      var className = 'hello-world';
      var options = { className: className };
      var textcomplete = new Textcomplete(textarea, { dropdown: options });
      textcomplete.register([
        {
          usernames: ['alice'],
          match: /(\w+)$/,
          search: function (term, callback) {
            callback(this.usernames.filter((username) => {
              return username.startsWith(term);
            }));
          },
          replace: function (username) {
            return `$1@${username} `;
          },
        },
      ]);

      textareaEl.value = '@a';
      var keyupEvent = document.createEvent('UIEvents');
      keyupEvent.initEvent('keyup', true, true);
      keyupEvent.keyCode = 50;
      textareaEl.dispatchEvent(keyupEvent);

      var dropdownEl = document.getElementsByClassName(className);
      assert.equal(dropdownEl.length, 1);
    });
  });
});
