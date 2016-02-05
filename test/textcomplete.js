import Textcomplete from '../src/textcomplete';
import {NO_RESULT, STILL_SEARCHING, SEARCH_COMPLETED} from '../src/textcomplete';
import {getHTMLTextAreaElement} from './test-helper';

const assert = require('power-assert');
const jsdom = require('jsdom');

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
      var stub = this.sinon.stub(textcomplete, 'trigger');

      var document = jsdom.jsdom();
      var e = document.createEvent('KeyboardEvent');
      e.initEvent('keyup', true, true);
      el.dispatchEvent(e);

      assert(stub.calledOnce);
      assert(stub.calledWith(''));

      stub.reset(); // Resets the state of spy.

      el.selectionStart = el.selectionEnd = 3; // Move input cursor.
      el.dispatchEvent(e);

      assert(stub.calledOnce);
      assert(stub.calledWith('abc'));
    });

    it('should call #completer.execute exclusvely', function () {
      var textcomplete = new Textcomplete(getHTMLTextAreaElement());
      var stub = this.sinon.stub(textcomplete.completer, 'execute');

      textcomplete.trigger('a');
      textcomplete.trigger('b');
      assert(stub.calledOnce);
      assert(stub.calledWith('a', textcomplete.handleQueryResult));

      textcomplete.unlock();
      assert(stub.calledTwice); // Replay
      assert(stub.calledWith('b', textcomplete.handleQueryResult));

      textcomplete.unlock().trigger('c');
      assert(stub.calledThrice);
      assert(stub.calledWith('c', textcomplete.handleQueryResult));

      textcomplete.trigger('d');
      assert(stub.calledThrice);
    });
  });

  describe('#handleQueryResult', function () {
    function sharedExample(status, dropdownMethod, unlock) {
      var textcomplete = new Textcomplete(getHTMLTextAreaElement());
      var stub = this.sinon.stub(textcomplete.dropdown, dropdownMethod);
      if (unlock) {
        var unlockStub = this.sinon.stub(textcomplete, 'unlock');
      } else {
        this.sinon.stub(textcomplete, 'unlock').throws();
      }
      textcomplete.handleQueryResult(status, []);
      assert(stub.calledOnce);
      if (unlock) {
        assert(unlockStub.calledOnce);
      }
    }

    context('when it is called with NO_RESULT', function () {
      it('should call #dropdown.deactivate and #unlock once', function () {
        sharedExample.call(this, NO_RESULT, 'deactivate', true);
      });
    });

    context('when it is called with STILL_SEARCHING', function () {
      it('should call #dropdown.render and not call #unlock once', function () {
        sharedExample.call(this, STILL_SEARCHING, 'render', false);
      });
    });

    context('when it is called with SEARCH_COMPLETED', function () {
      it('should call #dropdown.render and #unlock once', function () {
        sharedExample.call(this, SEARCH_COMPLETED, 'render', true);
      });
    });
  });
});
