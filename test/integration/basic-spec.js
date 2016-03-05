import Textcomplete from '../../src/textcomplete';
import Textarea from '../../src/textarea';

const assert = require('power-assert');

describe('Integration test', function () {
  var window, textareaEl, textarea, textcomplete;

  beforeEach(function () {
    window = document.defaultView;
    textareaEl = document.createElement('textarea');
    document.body.appendChild(textareaEl);
    textarea = new Textarea(textareaEl);
    textcomplete = new Textcomplete(textarea);
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

  it('should work with keyboard', function () {
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
    input(40, false, false, false, 'Hi, @a'); // down
    expectDropdownIsShown();
    input(13, false, false, false); // enter
    expectDropdownIsHidden();
    assert.equal(textareaEl.value, 'Hi, @amanda ');
    assert.equal(textareaEl.selectionStart, 12);
    assert.equal(textareaEl.selectionEnd, 12);
  });

  it('should work with touch event', function () {
    input(50, false, false, true, 'Hi, @'); // '@'
    expectDropdownIsHidden();
    input(65, false, false, false, 'Hi, @a'); // 'a'
    expectDropdownIsShown();
    var dropdownItemEl = document.querySelector('.textcomplete-item');
    var clickEvent = document.createEvent('TouchEvent');
    clickEvent.initEvent('touchstart', true, true);
    dropdownItemEl.dispatchEvent(clickEvent);
    expectDropdownIsHidden();
    assert.equal(textareaEl.value, 'Hi, @alice ');
    assert.equal(textareaEl.selectionStart, 11);
    assert.equal(textareaEl.selectionEnd, 11);
  });

  it('should work with mouse event', function () {
    input(50, false, false, true, 'Hi, @'); // '@'
    expectDropdownIsHidden();
    input(65, false, false, false, 'Hi, @a'); // 'a'
    expectDropdownIsShown();
    var dropdownItemEl = document.querySelector('.textcomplete-item');
    var clickEvent = document.createEvent('MouseEvent');
    clickEvent.initEvent('mousedown', true, true);
    dropdownItemEl.dispatchEvent(clickEvent);
    expectDropdownIsHidden();
    assert.equal(textareaEl.value, 'Hi, @alice ');
    assert.equal(textareaEl.selectionStart, 11);
    assert.equal(textareaEl.selectionEnd, 11);
  });
});
