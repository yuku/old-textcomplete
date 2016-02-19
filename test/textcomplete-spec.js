import Textcomplete from '../src/textcomplete';
import DropdownItem from '../src/dropdown-item';
import {ENTER, UP, DOWN} from '../src/editor';
import {NO_RESULT, STILL_SEARCHING, SEARCH_COMPLETED} from '../src/textcomplete';
import {createTextarea, createSearchResult} from './test-helper';

const assert = require('power-assert');

describe('Textcomplete', function () {
  var editor, textcomplete;

  beforeEach(function () {
    editor = createTextarea();
    textcomplete = new Textcomplete(editor);
  });

  describe('#register', function () {
    it('should return itself', function () {
      assert.strictEqual(textcomplete.register([{}]), textcomplete);
    });

    it('should call Completer#registerStrategy', function () {
      // TODO use spy object
    });
  });

  describe('#trigger', function () {
    it('should return itself', function () {
      assert.strictEqual(textcomplete.trigger(''), textcomplete);
    });

    it('should listen Editor#change', function () {
      var stub = this.sinon.stub(textcomplete, 'trigger');
      editor.emit('change', { beforeCursor: '' });
      assert(stub.calledOnce);
    });

    it('should call #completer.execute exclusvely', function () {
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
    function sharedExample(status, dropdownMethods, unlock) {
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

  describe('#handleSelect', function () {
    it('should call editor.applySearchResult', function () {
      var searchResult = createSearchResult();
      var dropdownItem = new DropdownItem(searchResult);
      var stub = this.sinon.stub(textcomplete.editor, 'applySearchResult');
      textcomplete.handleSelect(dropdownItem);
      assert(stub.calledOnce);
      assert(stub.calledWith(searchResult));
    });
  });

  describe('#handleMove', function () {
    var code, callback;

    function subject() {
      textcomplete.handleMove({ code, callback });
    }

    it('should listen Editor#move', function () {
      editor.removeAllListeners();
      var stub = this.sinon.stub(textcomplete, 'handleMove');
      textcomplete.startListening();
      editor.emit('move', { code: 1, callback: () => {} });
      assert(stub.calledOnce);
    });

    [
      { code_: ENTER, method: 'selectActiveItem' },
      { code_: UP,    method: 'up' },
      { code_: DOWN,  method: 'down' },
    ].forEach(({code_, method}) => {
      context(`when it is called with ${code_}`, function () {
        beforeEach(function () {
          code = code_;
          callback = () => {};
        });

        it(`should call #dropdown.${method}`, function () {
          var stub = this.sinon.stub(textcomplete.dropdown, method);
          subject();
          assert(stub.calledOnce);
          assert(stub.calledWith(this.sinon.match.func));
        });
      });
    });
  });
});
