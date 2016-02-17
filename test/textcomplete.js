import Textcomplete from '../src/textcomplete';
import {NO_RESULT, STILL_SEARCHING, SEARCH_COMPLETED} from '../src/textcomplete';
import {createTextarea} from './test-helper';

const assert = require('power-assert');

describe('Textcomplete', function () {
  describe('#register', function () {
    it('should return itself', function () {
      var textcomplete = new Textcomplete(createTextarea());
      assert.strictEqual(textcomplete.register([{}]), textcomplete);
    });

    it('should call Completer#registerStrategy', function () {
      // TODO use spy object
    });
  });

  describe('#trigger', function () {
    it('should return itself', function () {
      var textcomplete = new Textcomplete(createTextarea());
      assert.strictEqual(textcomplete.trigger(''), textcomplete);
    });

    it('should call #completer.execute exclusvely', function () {
      var textcomplete = new Textcomplete(createTextarea());
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

    context('when a keyup event occurs on the textarea', function () {
      beforeEach(function () {
        var textarea = createTextarea();
        this.el = textarea.el;
        this.textcomplete = new Textcomplete(textarea);
        this.e = document.createEvent('UIEvents');
        this.e.initEvent('keyup', true, true);
      });

      it('should be callbacked with a string', function () {
        this.el.value = 'abcdefg';
        var stub = this.sinon.stub(this.textcomplete, 'trigger');
        this.el.dispatchEvent(this.e);

        assert(stub.calledOnce);
        assert(stub.calledWith(''));

        stub.reset(); // Resets the state of spy.

        this.el.selectionStart = this.el.selectionEnd = 3; // Move input cursor.
        this.el.dispatchEvent(this.e);

        assert(stub.calledOnce);
        assert(stub.calledWith('abc'));
      });

      context('and move keys are pushed', function () {
        it('should be called with null', function () {
          var stub = this.sinon.stub(this.textcomplete, 'trigger');
          function calledOnceWithNull() {
            this.el.dispatchEvent(this.e);
            assert(stub.calledOnce);
            assert(stub.calledWith(null));
            stub.reset();
          }

          // up, down
          [38, 40].forEach((keyCode) => {
            this.e.keyCode = keyCode;
            calledOnceWithNull.call(this);
          });

          // ctrl-n, ctrl-p
          [78, 80].forEach((keyCode) => {
            this.e.keyCode = keyCode;
            this.e.ctrlKey = true;
            calledOnceWithNull.call(this);
          });
        });
      });
    });
  });

  describe('#handleQueryResult', function () {
    function sharedExample(status, dropdownMethods, unlock) {
      var textcomplete = new Textcomplete(createTextarea());
      var stubs = dropdownMethods.map((dropdownMethod) => {
        return this.sinon.stub(textcomplete.dropdown, dropdownMethod, function () {
          return this; // Dropdown methods return itself for method chaining.
        });
      });
      if (unlock) {
        var unlockStub = this.sinon.stub(textcomplete, 'unlock');
      } else {
        this.sinon.stub(textcomplete, 'unlock').throws();
      }
      textcomplete.handleQueryResult(status, []);
      stubs.forEach((stub) => { assert(stub.calledOnce); });
      if (unlock) {
        assert(unlockStub.calledOnce);
      }
    }

    context('when it is called with NO_RESULT', function () {
      it('should call #dropdown.deactivate and #unlock once', function () {
        sharedExample.call(this, NO_RESULT, ['deactivate'], true);
      });
    });

    context('when it is called with STILL_SEARCHING', function () {
      it('should call #dropdown.render and not call #unlock once', function () {
        sharedExample.call(this, STILL_SEARCHING, ['render'], false);
      });
    });

    context('when it is called with SEARCH_COMPLETED', function () {
      it('should call #dropdown.render, #dropdown.completed and #unlock once', function () {
        sharedExample.call(this, SEARCH_COMPLETED, ['render', 'completed'], true);
      });
    });
  });
});
