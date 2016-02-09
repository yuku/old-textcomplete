import Editor from '../src/editor';

const assert = require('power-assert');

describe('Editor', function () {
  describe('#registerTextcomplete', function () {
    it('should return itself', function () {
      var editor = new Editor();
      assert.strictEqual(editor.registerTextcomplete({}), editor);
    });

    it('should throw an error if a textcomplete has already been registered', function () {
      var editor = new Editor();
      editor.registerTextcomplete({});
      assert.throws(function () { editor.registerTextcomplete({}); });
    });
  });

  describe('#cursorOffset', function () {
    it('should throw an error', function () {
      var editor = new Editor();
      assert.throws(function () { editor.cursorOffset; });
    });
  });
});
