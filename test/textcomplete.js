import Textcomplete from '../src/textcomplete';
import {getHTMLTextAreaElement} from './test-helper';

const assert = require('power-assert');
const jsdom = require('jsdom');
const sinon = require('sinon');

describe('Textcomplete', function () {
  describe('#register', function () {
    it('should return itself', function () {
      var textcomplete = new Textcomplete(getHTMLTextAreaElement());
      assert.strictEqual(textcomplete.register([{}]), textcomplete);
    });

    it('should call Completer#registerStrategy', function () {
      // TODO use spy object
    });
  });

  describe('#trigger', function () {
    it('should return itself', function () {
      var textcomplete = new Textcomplete(getHTMLTextAreaElement());
      assert.strictEqual(textcomplete.trigger(''), textcomplete);
    });

    it('should be callbacked if keyup event occurs on the textarea', function () {
      var el = getHTMLTextAreaElement();
      el.value = 'abcdefg';

      var textcomplete = new Textcomplete(el);
      var spy = textcomplete.trigger = sinon.spy();

      var document = jsdom.jsdom();
      var e = document.createEvent('KeyboardEvent');
      e.initEvent('keyup', true, true);
      el.dispatchEvent(e);

      assert(spy.calledOnce);
      assert(spy.calledWith(''));

      spy.reset(); // Resets the state of spy.

      el.selectionStart = el.selectionEnd = 3; // Move input cursor.
      el.dispatchEvent(e);

      assert(spy.calledOnce);
      assert(spy.calledWith('abc'));
    });
  });
});
