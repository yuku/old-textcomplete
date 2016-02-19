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
      assert.strictEqual(dropdown.render([createSearchResult()], { top: 0, left: 0 }), dropdown);
    });

    context('when it is hidden', function () {
      it('should change #shown from false to true', function () {
        var dropdown = new Dropdown();
        dropdown.shown = false;
        dropdown.render([createSearchResult()], { top: 0, left: 0 });
        assert(dropdown.shown);
      });
    });

    context('when search results are given', function () {
      beforeEach(function () {
        this.dropdown = new Dropdown();
        this.searchResult = createSearchResult();
      });

      it('should append dropdown items with the search results', function () {
        this.dropdown.render([this.searchResult], { top: 0, left: 0 });
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

  describe('#append', function () {
    it('should call #appended of the appended dropdown item', function () {
      var dropdown = new Dropdown();
      var dropdownItem = new DropdownItem(createSearchResult());
      var stub = this.sinon.stub(dropdownItem, 'appended');
      dropdown.append([dropdownItem]);
      assert(stub.calledOnce);
      assert(stub.calledWith(dropdown));
    });
  });

  describe('#select', function () {
    var dropdown, dropdownItem;

    function subject() {
      dropdown.select(dropdownItem);
    }

    beforeEach(function () {
      dropdown = new Dropdown();
      dropdownItem = new DropdownItem(createSearchResult());
      dropdown.append([dropdownItem]);
    });

    it('should emit a select event', function () {
      var spy = this.sinon.spy();
      dropdown.on('select', spy);
      subject();
      assert(spy.calledOnce);
      assert(spy.calledWith({ searchResult: dropdownItem.searchResult }));
    });
  });

  describe('#selectActiveItem', function () {
    var dropdown, spy;

    function subject() {
      return dropdown.selectActiveItem(spy);
    }

    beforeEach(function () {
      dropdown = new Dropdown();
      spy = this.sinon.spy();
    });

    context('when it is shown', function () {
      beforeEach(function () {
        dropdown.show();
      });

      context('and there is an active item', function () {
        var activeItem;

        beforeEach(function () {
          dropdown.render([createSearchResult()], { top: 0, left: 0 });
          activeItem = dropdown.getActiveItem();
        });

        it('should callback with the active DropdownItem', function () {
          subject();
          assert(spy.calledOnce);
          assert(activeItem);
        });

        it('should be deactivated', function () {
          var stub = this.sinon.stub(dropdown, 'deactivate', () => { return dropdown; });
          subject();
          assert(stub.calledOnce);
        });

        it('should emit a select event', function () {
          var listener = this.sinon.spy();
          dropdown.on('select', listener);
          subject();
          assert(listener.calledOnce);
          assert(listener.calledWith({ searchResult: activeItem.searchResult }));
        });
      });

      context('and it does not contain a DropdownItem', function () {
        it('should not callback', function () {
          subject();
          assert(!spy.called);
        });
      });
    });

    context('when it is not shown', function () {
      beforeEach(function () {
        dropdown.hide();
      });

      it('should not callback', function () {
        subject();
        assert(!spy.called);
      });
    });
  });

  describe('#up', function () {
    var dropdown;

    beforeEach(function () {
      dropdown = new Dropdown();
    });

    context('when it is shown', function () {
      beforeEach(function () {
        dropdown.show();
      });

      context('and it contains DropdownItems', function () {
        it('should activate the previous DropdownItem and callback it', function () {
          dropdown.render([
            createSearchResult(),
            createSearchResult(),
            createSearchResult(),
          ], { top: 0, left: 0 });
          assert(dropdown.items[0].active);
          assert(!dropdown.items[1].active);
          assert(!dropdown.items[2].active);
          var spy = this.sinon.spy();
          dropdown.up(spy);
          assert(!dropdown.items[0].active);
          assert(!dropdown.items[1].active);
          assert(dropdown.items[2].active);
          assert(spy.calledOnce);
          assert(spy.calledWith(dropdown.items[2]));
        });
      });

      context('and it does not contain a DropdownItem', function () {
        it('should not callback', function () {
          var spy = this.sinon.spy();
          dropdown.up(spy);
          assert(!spy.called);
        });
      });
    });

    context('when it is not shown', function () {
      beforeEach(function () {
        dropdown.hide();
      });

      it('should not callback', function () {
        var spy = this.sinon.spy();
        dropdown.up(spy);
        assert(!spy.called);
      });
    });
  });

  describe('#down', function () {
    var dropdown;

    beforeEach(function () {
      dropdown = new Dropdown();
    });

    context('when it is shown', function () {
      beforeEach(function () {
        dropdown.show();
      });

      context('and it contains DropdownItems', function () {
        it('should activate the next DropdownItem', function () {
          dropdown.render([
            createSearchResult(),
            createSearchResult(),
            createSearchResult(),
          ], { top: 0, left: 0 });
          assert(dropdown.items[0].active);
          assert(!dropdown.items[1].active);
          assert(!dropdown.items[2].active);
          var spy = this.sinon.spy();
          dropdown.down(spy);
          assert(!dropdown.items[0].active);
          assert(dropdown.items[1].active);
          assert(!dropdown.items[2].active);
          assert(spy.calledOnce);
          assert(spy.calledWith(dropdown.items[1]));
        });
      });

      context('and it does not contain a DropdownItem', function () {
        it('should not callback', function () {
          var spy = this.sinon.spy();
          dropdown.down(spy);
          assert(!spy.called);
        });
      });
    });

    context('when it is not shown', function () {
      beforeEach(function () {
        dropdown.hide();
      });

      it('should not callback', function () {
        var spy = this.sinon.spy();
        dropdown.down(spy);
        assert(!spy.called);
      });
    });
  });
});
