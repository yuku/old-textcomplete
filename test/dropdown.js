import Dropdown from '../src/dropdown';

const assert = require('power-assert');

describe('Dropdown', function () {
  describe('.createElement', function () {
    it('should return a HTMLUListElement under body element', function () {
      var el = Dropdown.createElement();
      assert(el instanceof document.defaultView.HTMLUListElement);
      assert.equal(el.parentNode, document.body);
    });
  });

  describe('#el', function () {
    it('should return a object created by Dropdown.createElement()', function () {
      var result = {};
      var stub = this.sinon.stub(Dropdown, 'createElement', () => { return result; });
      var dropdown = new Dropdown();
      assert.strictEqual(dropdown.el, result);
      assert(stub.calledOnce);
      assert.strictEqual(dropdown.el, result);
      assert(stub.calledOnce); // Dropdown.createElement is not called.
    });
  });

  describe('#render', function () {
    it('should return itself', function () {
      var dropdown = new Dropdown();
      assert.strictEqual(dropdown.render(), dropdown);
    });

    context('when it is hidden', function () {
      it('should change #shown from false to true', function () {
        var dropdown = new Dropdown();
        dropdown.shown = false;
        dropdown.render();
        assert(dropdown.shown);
      });
    });
  });

  describe('#deactivate', function () {
    it('should return itself', function () {
      var dropdown = new Dropdown();
      assert.strictEqual(dropdown.deactivate(), dropdown);
    });

    it('should empty #items', function () {
      var dropdown = new Dropdown();
      dropdown.items = [1];
      assert.equal(dropdown.items.length, 1);
      dropdown.deactivate();
      assert.equal(dropdown.items.length, 0);
    });

    context('when it is shown', function () {
      it('should change #shown from true to false', function () {
        var dropdown = new Dropdown();
        dropdown.shown = true;
        dropdown.deactivate();
        assert(!dropdown.shown);
      });
    });
  });
});
