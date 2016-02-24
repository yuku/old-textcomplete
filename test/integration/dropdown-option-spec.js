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

  function setup(option) {
    var textcomplete = new Textcomplete(textarea, { dropdown: option });
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
    return textcomplete;
  }

  describe('className', function () {
    it('should be set as class attribute of dropdown element', function () {
      var className = 'hello-world';
      textarea = setup({ className: className });
      textareaEl.value = '@a';
      var keyupEvent = document.createEvent('UIEvents');
      keyupEvent.initEvent('keyup', true, true);
      keyupEvent.keyCode = 50;
      textareaEl.dispatchEvent(keyupEvent);

      var dropdownEl = document.getElementsByClassName(className);
      assert.equal(dropdownEl.length, 1);
    });
  });

  describe('style', function () {
    it('should be set as style attribute of dropdown element', function () {
      textarea = setup({ style: { backgroundColor: '#f0f' } });
      textareaEl.value = '@a';
      var keyupEvent = document.createEvent('UIEvents');
      keyupEvent.initEvent('keyup', true, true);
      keyupEvent.keyCode = 50;
      textareaEl.dispatchEvent(keyupEvent);

      var dropdownEl = document.getElementsByClassName('textcomplete-dropdown')[0];
      assert.equal(dropdownEl.style.backgroundColor, 'rgb(255, 0, 255)');
    });
  });
});
