import Textcomplete from '../../src/textcomplete';
import Textarea from '../../src/textarea';

const assert = require('power-assert');

describe('Textcomplete events', function () {
  var textareaEl, textarea, textcomplete;

  beforeEach(function () {
    textareaEl = document.createElement('textarea');
    document.body.appendChild(textareaEl);
    textarea = new Textarea(textareaEl);
    textcomplete = new Textcomplete(textarea);
    textcomplete.register([{
      usernames: ['aby'],
      match: /(\s|^)@(\w+)$/,
      search: function (term, callback) {
        callback(this.usernames.filter(username => username.startsWith(term)));
      },
      replace: function (username) {
        return `$1@${username} `;
      },
    }]);
  });

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

  function assertCalled(spy) {
    assert(spy.calledOnce);
  }

  function assertNotCalled(spy) {
    assert(!spy.called);
  }

  it('should be emitted', function () {
    var showSpy = this.sinon.spy();
    var shownSpy = this.sinon.spy();
    var renderedSpy = this.sinon.spy();
    var hideSpy = this.sinon.spy();
    var hiddenSpy = this.sinon.spy();

    textcomplete.on('show', showSpy)
                .on('shown', shownSpy)
                .on('rendered', renderedSpy)
                .on('hide', hideSpy)
                .on('hidden', hiddenSpy);

    function reset() {
      [showSpy, shownSpy, renderedSpy, hideSpy, hiddenSpy].forEach(spy => spy.reset());
    }

    input(50, false, false, true, 'Hi, @'); // '@'
    [showSpy, shownSpy, renderedSpy, hideSpy, hiddenSpy].forEach(assertNotCalled);
    reset();

    input(65, false, false, false, 'Hi, @a'); // 'a'
    [showSpy, shownSpy, renderedSpy].forEach(assertCalled);
    [hideSpy, hiddenSpy].forEach(assertNotCalled);
    reset();

    input(66, false, false, false, 'Hi, @ab'); // 'b'
    [renderedSpy].forEach(assertCalled);
    [showSpy, shownSpy, hideSpy, hiddenSpy].forEach(assertNotCalled);
    reset();

    input(8, false, false, false, 'Hi, @a'); // backspace
    [renderedSpy].forEach(assertCalled);
    [showSpy, shownSpy, hideSpy, hiddenSpy].forEach(assertNotCalled);
    reset();

    input(8, false, false, false, 'Hi, @'); // backspace
    [hideSpy, hiddenSpy].forEach(assertCalled);
    [showSpy, shownSpy, renderedSpy].forEach(assertNotCalled);
    reset();
  });
});
