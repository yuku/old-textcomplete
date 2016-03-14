import Textcomplete from '../../src/textcomplete';
import Textarea from '../../src/textarea';
import {CLASS_NAME} from '../../src/dropdown_item';

const assert = require('power-assert');

describe('Dropdown options integration test', function () {
  var textareaEl, textarea;

  beforeEach(function () {
    textareaEl = document.createElement('textarea');
    document.body.appendChild(textareaEl);
    textarea = new Textarea(textareaEl);
  });

  function setup(option, strategy) {
    var textcomplete = new Textcomplete(textarea, { dropdown: option });
    textcomplete.register([strategy]);
    return textcomplete;
  }

  describe('className', function () {
    it('should be set as class attribute of dropdown element', function () {
      var className = 'hello-world';
      setup({ className }, {
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
      });
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
      setup({ style: { backgroundColor: '#f0f' } }, {
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
      });
      textareaEl.value = '@a';
      var keyupEvent = document.createEvent('UIEvents');
      keyupEvent.initEvent('keyup', true, true);
      keyupEvent.keyCode = 50;
      textareaEl.dispatchEvent(keyupEvent);

      var dropdownEl = document.getElementsByClassName('textcomplete-dropdown')[0];
      assert.equal(dropdownEl.style.backgroundColor, 'rgb(255, 0, 255)');
    });
  });

  describe('maxCount', function () {
    it('should truncate the items of dropdown', function () {
      var maxCount = 3;
      setup({ maxCount }, {
        match: /(\s|^)@(\w+)$/,
        search: function (term, callback) { callback([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]); },
        replace: function (value) { return value; },
      });

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
