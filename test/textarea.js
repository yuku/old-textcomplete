import {createTextarea, createSearchResult} from './test-helper';

const assert = require('power-assert');

describe('Textarea', function () {
  describe('#applySearchResult', function () {
    var textarea, searchResult;

    beforeEach(function () {
      textarea = createTextarea();
    });

    context('when SearchResult#replace returns null', function () {
      beforeEach(function () {
        searchResult = createSearchResult();
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
        searchResult = createSearchResult();
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
});
