import Dropdown from '../src/dropdown';
import DropdownItem from '../src/dropdown-item';
import {createSearchResult} from './test-helper';

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
      assert.strictEqual(dropdown.render([createSearchResult()]), dropdown);
    });

    context('when it is hidden', function () {
      it('should change #shown from false to true', function () {
        var dropdown = new Dropdown();
        dropdown.shown = false;
        dropdown.render([createSearchResult()]);
        assert(dropdown.shown);
      });
    });

    context('when search results are given', function () {
      beforeEach(function () {
        this.dropdown = new Dropdown();
        this.searchResult = createSearchResult();
      });

      it('should append dropdown items with the search results', function () {
        this.dropdown.render([this.searchResult]);
        assert.equal(this.dropdown.items.length, 1);
        assert(this.dropdown.items[0] instanceof DropdownItem);
        assert.equal(this.dropdown.items[0].searchResult, this.searchResult);
      });
    });

    context('when it is completed', function () {
      it('should call #clear', function () {
        var dropdown = new Dropdown();
        dropdown.completed();
        var stub = this.sinon.stub(dropdown, 'clear');
        dropdown.render([], { top: 0, left: 0 });
        assert(stub.calledOnce);
      });
    });
  });

  describe('#deactivate', function () {
    it('should return itself', function () {
      var dropdown = new Dropdown();
      assert.strictEqual(dropdown.deactivate(), dropdown);
    });

    it('should empty itself', function () {
      var dropdown = new Dropdown();
      dropdown.append([new DropdownItem(createSearchResult())]);
      assert.equal(dropdown.length, 1);
      dropdown.deactivate();
      assert.equal(dropdown.length, 0);
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
