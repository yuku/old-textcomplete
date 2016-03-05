import Textcomplete from '../../src/textcomplete';
import Strategy from '../../src/strategy';
import {createTextarea} from '../test-helper';

const assert = require('power-assert');

describe('Textcomplete', function () {
  var editor, textcomplete;

  beforeEach(function () {
    editor = createTextarea();
    textcomplete = new Textcomplete(editor);
  });

  describe('#register', function () {
    var props;

    function subject() {
      return textcomplete.register([props]);
    }

    beforeEach(function () {
      props = {};
    });

    it('should return itself', function () {
      assert.strictEqual(subject(), textcomplete);
    });

    it('should call Completer#registerStrategy', function () {
      var stub = this.sinon.stub(textcomplete.completer, 'registerStrategy');
      subject();
      assert(stub.calledOnce);
      assert(stub.calledWith(this.sinon.match.instanceOf(Strategy)));
      assert(stub.calledWith(this.sinon.match.hasOwn('props', props)));
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

    it('should call #completer.run exclusvely', function () {
      var stub = this.sinon.stub(textcomplete.completer, 'run');

      textcomplete.trigger('a');
      textcomplete.trigger('b');
      assert(stub.calledOnce);
      assert(stub.calledWith('a'));

      textcomplete.unlock();
      assert(stub.calledTwice); // Replay
      assert(stub.calledWith('b'));

      textcomplete.unlock().trigger('c');
      assert(stub.calledThrice);
      assert(stub.calledWith('c'));

      textcomplete.trigger('d');
      assert(stub.calledThrice);
    });
  });

  describe('events', function () {
    ['show', 'shown', 'rendered', 'hide', 'hidden'].forEach(eventName => {
      context(`when Dropdown#${eventName} occurs`, function () {
        function subject() {
          textcomplete.dropdown.emit(eventName);
        }

        it(`should emit Textcomplete#${eventName}`, function () {
          var spy = this.sinon.spy();
          textcomplete.on(eventName, spy);
          subject();
          assert(spy.calledOnce);
        });
      });
    });
  });
});
