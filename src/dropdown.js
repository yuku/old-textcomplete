import DropdownItem from './dropdown-item';
import {extend, uniqueId} from 'lodash';

/**
 * Encapsulate a dropdown view.
 *
 * @prop {boolean} shown - Whether the #el is shown or not.
 * @prop {DropdownItem[]} items - The array of rendered dropdown items.
 */
export default class Dropdown {
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
    this.shown = false;
    this.items = [];
    this._completed = true;
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
    if (this._completed) {
      this._completed = false;
      this.clear();
    }
    this.append(searchResults.map((searchResult) => {
      return new DropdownItem(searchResult);
    }));
    return this.items.length > 0 ? this.setOffset(cursorOffset).show() : this.hide();
  }

  /**
   * Mark itself as completed. `#clear` is going to be called before
   * rendering a completed dropdown.
   *
   * @returns {this}
   */
  completed() {
    this._completed = true;
    return this;
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
}
