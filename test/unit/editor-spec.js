import Editor from '../../src/editor';
import {createSearchResult} from '../test-helper';
import {EventEmitter} from 'events';

const assert = require('power-assert');

describe('Editor', function () {
  var editor;

  beforeEach(function () {
    editor = new Editor();
  });

  it('should be an EventEmitter', function () {
    assert(editor instanceof EventEmitter);
  });

  describe('#applySearchResult', function () {
    it('should throw an error', function () {
      assert.throws(function () { editor.applySearchResult(createSearchResult()); });
    });
  });

  describe('#cursorOffset', function () {
    it('should throw an error', function () {
      assert.throws(function () { editor.cursorOffset; });
    });
  });
});
