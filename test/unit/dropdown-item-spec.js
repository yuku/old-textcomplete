import DropdownItem from '../../src/dropdown-item';
import {createSearchResult} from '../test-helper';

const assert = require('power-assert');

describe('DropdownItem', function () {
  var dropdownItem;

  beforeEach(function () {
    dropdownItem = new DropdownItem(createSearchResult());
  });

  describe('#el', function () {
    it('should be a HTMLLIElement with same id', function () {
      assert(dropdownItem.el instanceof document.defaultView.HTMLLIElement);
      assert.equal(dropdownItem.el.id, dropdownItem.id);
    });
  });

  describe('#activate', function () {
    it('should change #active to true', function () {
      dropdownItem.active = false;
      dropdownItem.activate();
      assert.equal(dropdownItem.active, true);
    });

    it('should add "active" to #el.className', function () {
      dropdownItem.active = false;
      assert(dropdownItem.el.className.indexOf('active') === -1);
      dropdownItem.activate();
      assert(dropdownItem.el.className.indexOf('active') !== -1);
    });
  });

  describe('#deactivate', function () {
    it('should change #active to false', function () {
      dropdownItem.active = true;
      dropdownItem.deactivate();
      assert.equal(dropdownItem.active, false);
    });

    it('should add "active" to #el.className', function () {
      dropdownItem.active = true;
      assert(dropdownItem.el.className.indexOf('active') !== -1);
      dropdownItem.deactivate();
      assert(dropdownItem.el.className.indexOf('active') === -1);
    });
  });
});
