import DropdownItem from './dropdown-item';
import {extend, uniqueId} from 'lodash';
import {EventEmitter} from 'events';

/**
 * Encapsulate a dropdown view.
 *
 * @prop {boolean} shown - Whether the #el is shown or not.
 * @prop {DropdownItem[]} items - The array of rendered dropdown items.
 * @extends EventEmitter
 */
class Dropdown extends EventEmitter {
  /**
   * @returns {HTMLUListElement}
   */
  static createElement() {
    var el = document.createElement('ul');
    el.className = 'dropdown-menu textcomplete-dropdown';
    el.id = uniqueId('textcomplete-dropdown-');
    extend(el.style, {
      display: 'none',
      left: 0,
      position: 'absolute',
      zIndex: 10000,
    });
    document.body.appendChild(el);
    return el;
  }

  constructor() {
    super();
    this.shown = false;
    this.items = [];
  }

  /**
   * @private
   * @returns {HTMLUListElement}
   */
  get el() {
    this._el || (this._el = Dropdown.createElement());
    return this._el;
  }

  /**
   * @returns {number}
   */
  get length() {
    return this.items.length;
  }

  /**
   * Render the given data as dropdown items.
   *
   * @param {SearchResult[]} searchResults
   * @param {{top: number, left: number}} cursorOffset
   * @returns {this}
   */
  render(searchResults, cursorOffset) {
    this.clear().append(searchResults.map((searchResult) => {
      return new DropdownItem(searchResult);
    }));
    return this.items.length > 0 ? this.setOffset(cursorOffset).show() : this.hide();
  }

  /**
   * Hide the dropdown then sweep out items.
   *
   * @returns {this}
   */
  deactivate() {
    return this.hide().clear();
  }

  /**
   * @param {DropdownItem} dropdownItem
   * @returns {this}
   * @fires Dropdown#select
   */
  select(dropdownItem) {
    /**
      * @event Dropdown#select
      * @type {object}
      * @prop {SearchResult} searchResult
      */
    this.emit('select', { searchResult: dropdownItem.searchResult });
    return this.deactivate();
  }

  /**
   * @param {function} callback
   * @returns {this}
   * @fires Dropdown#select
   */
  selectActiveItem(callback) {
    if (this.shown) {
      var activeItem = this.getActiveItem();
      if (activeItem) {
        this.select(activeItem);
        callback(activeItem);
      }
    }
    return this;
  }

  /**
   * @param {function} callback
   * @returns {this}
   */
  up(callback) {
    return this.moveActiveItem('prev', callback);
  }

  /**
   * @param {function} callback
   * @returns {this}
   */
  down(callback) {
    return this.moveActiveItem('next', callback);
  }

  /**
   * Add items to dropdown.
   *
   * @private
   * @param {DropdownItem[]} items
   * @returns {this};
   */
  append(items) {
    var fragment = document.createDocumentFragment();
    items.forEach((item) => {
      this.items.push(item);
      item.appended(this);
      fragment.appendChild(item.el);
    });
    this.el.appendChild(fragment);
    return this;
  }

  /**
   * @private
   * @param {{top: number, left: number}} cursorOffset
   * @returns {this}
   */
  setOffset(cursorOffset) {
    this.el.style.top = `${cursorOffset.top}px`;
    this.el.style.left = `${cursorOffset.left}px`;
    return this;
  }

  /**
   * Show the element.
   *
   * @private
   * @returns {this}
   */
  show() {
    if (!this.shown) {
      this.el.style.display = 'block';
      this.shown = true;
    }
    return this;
  }

  /**
   * Hide the element.
   *
   * @private
   * @returns {this}
   */
  hide() {
    if (this.shown) {
      this.el.style.display = 'none';
      this.shown = false;
    }
    return this;
  }

  /**
   * Clear search results.
   *
   * @private
   * @returns {this}
   */
  clear() {
    this.el.innerHTML = '';
    this.items.forEach((item) => { item.finalize(); });
    this.items = [];
    return this;
  }

  /**
   * Retrieve the active item.
   *
   * @private
   * @returns {DropdownItem|undefined}
   */
  getActiveItem() {
    return this.items.find((item) => { return item.active; });
  }

  /**
   * @private
   * @param {string} name
   * @param {function} callback
   * @returns {this}
   */
  moveActiveItem(name, callback) {
    if (this.shown) {
      let activeItem = this.getActiveItem();
      if (activeItem) {
        activeItem.deactivate();
        callback(activeItem[name].activate());
      }
    }
    return this;
  }
}

export default Dropdown;
