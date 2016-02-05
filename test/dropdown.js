import Dropdown from '../src/dropdown';

const assert = require('power-assert');
const jsdom = require('jsdom');

describe('Dropdown', function () {
  describe('.createElement', function () {
    before(function () {
      global.document = jsdom.jsdom();
    });

    after(function () {
      delete global.document;
    });

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
});
