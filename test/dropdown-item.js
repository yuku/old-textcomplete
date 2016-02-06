import DropdownItem from '../src/dropdown-item';
import {createSearchResult} from './test-helper';

const assert = require('power-assert');

describe('DropdownItem', function () {
  describe('#el', function () {
    it('should be a HTMLLIElement with same id', function () {
      var dropdownItem = new DropdownItem(createSearchResult());
      assert(dropdownItem.el instanceof document.defaultView.HTMLLIElement);
      assert.equal(dropdownItem.el.id, dropdownItem.id);
    });
  });
});
