import Textcomplete from '../src/textcomplete';
import Textarea from '../src/textarea';

const assert = require('power-assert');

describe('Integration test', function () {
  var window, textareaEl;

  beforeEach(function () {
    window = document.defaultView;
    textareaEl = document.createElement('textarea');
    document.body.appendChild(textareaEl);
  });

  /**
   * Emulate inputing a char to the textarea element.
   *
   * @param {number} keyCode
   * @param {boolean} altKey
   * @param {boolean} ctrlKey
   * @param {boolean} shiftKey
   * @param {string} value
   * @param {?number} position
   */
  function input(keyCode, altKey, ctrlKey, shiftKey, value, position) {
    var keydownEvent = document.createEvent('UIEvents');
    var keyupEvent = document.createEvent('UIEvents');
    keydownEvent.initEvent('keydown', true, true);
    keyupEvent.initEvent('keyup', true, true);
    keyupEvent.keyCode = keydownEvent.keyCode = keyCode;
    keyupEvent.altKey = keydownEvent.altKey = altKey;
    keyupEvent.ctrlKey = keydownEvent.ctrlKey = ctrlKey;
    keyupEvent.shiftKey = keydownEvent.shiftKey = shiftKey;
    textareaEl.dispatchEvent(keydownEvent);
    if (value) {
      textareaEl.value = value;
      textareaEl.selectionStart = textareaEl.selectionEnd = position || value.length;
    }
    textareaEl.dispatchEvent(keyupEvent);
  }

  it('should work', function () {
    var textarea = new Textarea(textareaEl);
    var textcomplete = new Textcomplete(textarea);
    textcomplete.register([
      {
        usernames: ['alice', 'amanda', 'bob', 'carol', 'dave'],
        match: /(^|\s)@(\w+)$/,
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

    function expectDropdownIsShown() {
      var dropdownEl = document.querySelector('.dropdown-menu.textcomplete-dropdown');
      var computed = window.getComputedStyle(dropdownEl);
      assert.equal(computed.display, 'block');
    }

    function expectDropdownIsHidden() {
      var dropdownEl = document.querySelector('.dropdown-menu.textcomplete-dropdown');
      var computed = window.getComputedStyle(dropdownEl);
      assert.equal(computed.display, 'none');
    }

    input(50, false, false, true, 'Hi, @'); // '@'
    expectDropdownIsHidden();
    input(65, false, false, false, 'Hi, @a'); // 'a'
    expectDropdownIsShown();
    input(66, false, false, false, 'Hi, @ab'); // 'b'
    expectDropdownIsHidden();
    input(8, false, false, false, 'Hi, @a'); // backspace
    expectDropdownIsShown();
    input(76, false, false, false, 'Hi, @al'); // 'l'
    expectDropdownIsShown();
    input(8, false, false, false, 'Hi, @a'); // backspace
    expectDropdownIsShown();
    input(40, false, false, false, 'Hi, @a'); // down
    expectDropdownIsShown();
    input(13, false, false, false); // enter
    expectDropdownIsHidden();
    assert.equal(textareaEl.value, 'Hi, @amanda ');
    assert.equal(textareaEl.selectionStart, 12);
    assert.equal(textareaEl.selectionEnd, 12);
  });
});
