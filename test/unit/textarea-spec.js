import {ENTER, UP, DOWN} from '../../src/editor';
import {createTextarea, createSearchResult} from '../test-helper';
import isNumber from 'lodash.isnumber';

const assert = require('power-assert');

describe('Textarea', function () {
  var textarea;

  beforeEach(function () {
    textarea = createTextarea();
  });

  context('when a keydown event occurs', function () {
    var event;

    function subject() {
      return textarea.el.dispatchEvent(event);
    }

    beforeEach(function () {
      event = document.createEvent('UIEvents');
      event.initEvent('keydown', true, true);
    });

    [ENTER, DOWN, UP].forEach(function (code) {
      context(`and it is a ${code} key`, function () {
        beforeEach(function () {
          this.sinon.stub(textarea, 'getCode', () => { return code; });
        });

        it('should emit a move event', function () {
          var spy = this.sinon.spy();
          textarea.on('move', spy);
          subject();
          assert(spy.calledOnce);
          assert(spy.calledWith({ code: code, callback: this.sinon.match.func }));
        });
      });
    });

    context('and it is a normal key', function () {
      beforeEach(function () {
        this.sinon.stub(textarea, 'getCode', () => { return null; });
      });

      it('should not emit a move event', function () {
        var spy = this.sinon.spy();
        textarea.on('move', spy);
        subject();
        assert(!spy.called);
      });
    });
  });

  context('when a keyup event occurs', function () {
    var event;

    function subject() {
      return textarea.el.dispatchEvent(event);
    }

    beforeEach(function () {
      event = document.createEvent('UIEvents');
      event.initEvent('keyup', true, true);
    });

    context('and it is a move key', function () {
      beforeEach(function () {
        this.sinon.stub(textarea, 'isMoveKeyEvent', () => { return true; });
      });

      it('should not emit a change event', function () {
        var spy = this.sinon.spy();
        textarea.on('change', spy);
        subject();
        assert(!spy.called);
      });
    });

    context('and it is not a move key', function () {
      beforeEach(function () {
        this.sinon.stub(textarea, 'isMoveKeyEvent', () => { return false; });
      });

      it('should emit a change event', function () {
        textarea.el.value = 'abcdefg';

        var spy = this.sinon.spy();
        textarea.on('change', spy);
        subject();
        assert(spy.calledOnce);
        assert(spy.calledWith({ beforeCursor: '' }));

        spy.reset();
        textarea.el.selectionStart = textarea.el.selectionEnd = 3;
        subject();
        assert(spy.calledOnce);
        assert(spy.calledWith({ beforeCursor: 'abc' }));
      });
    });
  });

  describe('#applySearchResult', function () {
    var searchResult;

    beforeEach(function () {
      searchResult = createSearchResult();
    });

    context('when SearchResult#replace returns null', function () {
      beforeEach(function () {
        this.sinon.stub(searchResult, 'replace', function () {
          return null;
        });
      });

      it('should not change #el.value', function () {
        var prevValue = textarea.el.value = 'previous value';
        textarea.applySearchResult(searchResult);
        assert.equal(textarea.el.value, prevValue);
      });

      it('should not change #el.selectionStart and selectionEnd', function () {
        textarea.el.value = 'value';
        var prevValue = textarea.el.selectionStart = textarea.el.selectionEnd = 3;
        textarea.applySearchResult(searchResult);
        assert.equal(textarea.el.selectionStart, prevValue);
        assert.equal(textarea.el.selectionEnd, prevValue);
      });
    });

    context('when SearchResult#replace returns an array of strings', function () {
      beforeEach(function () {
        this.sinon.stub(searchResult, 'replace', function () {
          return ['before', 'after'];
        });
      });

      it('should change #el.value', function () {
        textarea.el.value = 'previous value';
        textarea.applySearchResult(searchResult);
        assert.equal(textarea.el.value, 'beforeafter');
      });

      it('should change #el.selectionStart and selectionEnd', function () {
        textarea.el.value = 'previous value';
        textarea.applySearchResult(searchResult);
        assert.equal(textarea.el.selectionStart, 'before'.length);
        assert.equal(textarea.el.selectionEnd, 'before'.length);
      });
    });
  });

  describe('#cursorOffset', function () {
    var textareaEl;

    beforeEach(function () {
      textareaEl = textarea.el;
    });

    function subject() {
      return textarea.cursorOffset;
    }

    context('when dir attribute of the element is "ltr"', function () {
      beforeEach(function () {
        textareaEl.dir = 'ltr';
      });

      it('should return an object with top and left properties', function () {
        var result = subject();
        ['top', 'left'].forEach(name => {
          assert(isNumber(result[name]));
        });
        assert(!result.hasOwnProperty('right'));
      });
    });

    context('when dir attribute of the element is "rtl"', function () {
      beforeEach(function () {
        textareaEl.dir = 'rtl';
      });

      it('should return an object with top and right properties', function () {
        var result = subject();
        ['top', 'right'].forEach(name => {
          assert(isNumber(result[name]));
        });
        assert(!result.hasOwnProperty('left'));
      });
    });
  });
});
