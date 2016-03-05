import Dropdown from '../../src/dropdown';
import DropdownItem from '../../src/dropdown-item';
import {createSearchResult} from '../test-helper';

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
      var dropdown = new Dropdown({});
      assert.strictEqual(dropdown.el, result);
      assert(stub.calledOnce);
      assert.strictEqual(dropdown.el, result);
      assert(stub.calledOnce); // Dropdown.createElement is not called.
    });

    context('with className option', function () {
      it('should return a element with the class name', function () {
        var className = 'hello-world';
        var dropdown = new Dropdown({ className: className });
        assert.equal(dropdown.el.className, className);
      });
    });

    context('with style option', function () {
      it('should return a element with custom style attribute', function () {
        var style = { backgroundColor: '#f0f' };
        var dropdown = new Dropdown({ style: style });
        assert.equal(dropdown.el.style.backgroundColor, 'rgb(255, 0, 255)');
      });
    });
  });

  describe('#render', function () {
    var dropdown, searchResult;

    function subject() {
      return dropdown.render([searchResult], { top: 0, left: 0 });
    }

    beforeEach(function () {
      searchResult = createSearchResult();
    });

    it('should return itself', function () {
      dropdown = new Dropdown({});
      assert.strictEqual(subject(), dropdown);
    });

    context('when search results are given', function () {
      it('should append dropdown items with the search results', function () {
        dropdown = new Dropdown({});
        subject();
        assert.equal(dropdown.items.length, 1);
        assert(dropdown.items[0] instanceof DropdownItem);
        assert.equal(dropdown.items[0].searchResult, searchResult);
      });

      context('and it has not been shown', function () {
        it('should change #shown from false to true', function () {
          dropdown = new Dropdown({});
          dropdown.shown = false;
          subject();
          assert(dropdown.shown);
        });

        ['show', 'shown', 'rendered'].forEach(eventName => {
          it(`should emit ${eventName} event`, function () {
            var spy = this.sinon.spy();
            dropdown = new Dropdown({});
            dropdown.shown = false;
            dropdown.on(eventName, spy);
            subject();
            assert(spy.calledOnce);
          });
        });

        ['hide', 'hidden'].forEach(eventName => {
          it(`should not emit ${eventName} event`, function () {
            var spy = this.sinon.spy();
            dropdown = new Dropdown({});
            dropdown.shown = true;
            dropdown.on(eventName, spy);
            subject();
            assert(!spy.called);
          });
        });
      });

      context('and it has been shown', function () {
        it('should emit rendered event', function () {
          var spy = this.sinon.spy();
          dropdown = new Dropdown({});
          dropdown.shown = false;
          dropdown.on('rendered', spy);
          subject();
          assert(spy.calledOnce);
        });

        ['show', 'shown', 'hide', 'hidden'].forEach(eventName => {
          it(`should not emit ${eventName} event`, function () {
            var spy = this.sinon.spy();
            dropdown = new Dropdown({});
            dropdown.shown = true;
            dropdown.on(eventName, spy);
            subject();
            assert(!spy.called);
          });
        });
      });
    });

    context('when search results are empty', function () {
      function subject_() {
        return dropdown.render([], { top: 0, left: 0 });
      }

      context('and it has been shown', function () {
        it('should change #shown from true to false', function () {
          dropdown = new Dropdown({});
          dropdown.shown = true;
          subject_();
          assert(!dropdown.shown);
        });

        ['hide', 'hidden'].forEach(eventName => {
          it(`should emit ${eventName} event`, function () {
            var spy = this.sinon.spy();
            dropdown = new Dropdown({});
            dropdown.shown = true;
            dropdown.on(eventName, spy);
            subject_();
            assert(spy.calledOnce);
          });
        });

        ['show', 'shown', 'rendered'].forEach(eventName => {
          it(`should not emit ${eventName} event`, function () {
            var spy = this.sinon.spy();
            dropdown = new Dropdown({});
            dropdown.shown = true;
            dropdown.on(eventName, spy);
            subject_();
            assert(!spy.called);
          });
        });
      });

      context('and it has not been shown', function () {
        ['show', 'shown', 'rendered', 'hide', 'hidden'].forEach(eventName => {
          it(`should not emit ${eventName} event`, function () {
            var spy = this.sinon.spy();
            dropdown = new Dropdown({});
            dropdown.shown = false;
            dropdown.on(eventName, spy);
            subject_();
            assert(!spy.called);
          });
        });
      });
    });

    context('when header option is given', function () {
      var header;

      function sharedExample() {
        it('should show .textcomplete-header', function () {
          subject();
          var el = dropdown.el.childNodes[0];
          assert.equal(el.className, 'textcomplete-header');
        });
      }

      context('and it is a string', function () {
        beforeEach(function () {
          header = 'header';
          dropdown = new Dropdown({ header });
        });

        sharedExample();
      });

      context('and it is a function', function () {
        beforeEach(function () {
          header = this.sinon.spy();
          dropdown = new Dropdown({ header });
        });

        sharedExample();

        it('should call the function with raw search results', function () {
          subject();
          assert(header.calledOnce);
          assert(header.calledWith([searchResult.data]));
        });
      });
    });

    context('when footer option is given', function () {
      var footer;

      function sharedExample() {
        it('should show .textcomplete-footer', function () {
          subject();
          var nodes = dropdown.el.childNodes;
          var el = nodes[nodes.length - 1];
          assert.equal(el.className, 'textcomplete-footer');
        });
      }

      context('and it is a string', function () {
        beforeEach(function () {
          footer = 'footer';
          dropdown = new Dropdown({ footer });
        });

        sharedExample();
      });

      context('and it is a function', function () {
        beforeEach(function () {
          footer = this.sinon.spy();
          dropdown = new Dropdown({ footer });
        });

        sharedExample();

        it('should call the function with raw search results', function () {
          subject();
          assert(footer.calledOnce);
          assert(footer.calledWith([searchResult.data]));
        });
      });
    });
  });

  describe('#deactivate', function () {
    it('should return itself', function () {
      var dropdown = new Dropdown({});
      assert.strictEqual(dropdown.deactivate(), dropdown);
    });

    it('should empty itself', function () {
      var dropdown = new Dropdown({});
      dropdown.append([new DropdownItem(createSearchResult())]);
      assert.equal(dropdown.length, 1);
      dropdown.deactivate();
      assert.equal(dropdown.length, 0);
    });

    context('when it is shown', function () {
      it('should change #shown from true to false', function () {
        var dropdown = new Dropdown({});
        dropdown.shown = true;
        dropdown.deactivate();
        assert(!dropdown.shown);
      });
    });
  });

  describe('#append', function () {
    it('should call #appended of the appended dropdown item', function () {
      var dropdown = new Dropdown({});
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
      dropdown = new Dropdown({});
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
      dropdown = new Dropdown({});
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
          activeItem = dropdown.items[0].activate();
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
      dropdown = new Dropdown({});
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
          assert(!dropdown.items[0].active);
          assert(!dropdown.items[1].active);
          assert(!dropdown.items[2].active);

          var spy = this.sinon.spy();
          dropdown.up(spy);
          assert(!dropdown.items[0].active);
          assert(!dropdown.items[1].active);
          assert(dropdown.items[2].active);
          assert(spy.calledOnce);
          assert(spy.calledWith(dropdown.items[2]));

          spy.reset();
          dropdown.up(spy);
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
      dropdown = new Dropdown({});
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
          assert(!dropdown.items[0].active);
          assert(!dropdown.items[1].active);
          assert(!dropdown.items[2].active);

          var spy = this.sinon.spy();
          dropdown.down(spy);
          assert(dropdown.items[0].active);
          assert(!dropdown.items[1].active);
          assert(!dropdown.items[2].active);
          assert(spy.calledOnce);
          assert(spy.calledWith(dropdown.items[0]));

          spy.reset();
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
