import {extend, uniqueId} from 'lodash';

/**
 * Encapsulate a dropdown view.
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
   * Render the given data as dropdown items.
   *
   * @param {SearchResult[]} _searchResults
   * @param {{top: number, left: number}} _cursorPosition
   * @returns {this}
   */
  render(_searchResults, _cursorPosition) {
    this.show();
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
    this.items = [];
    return this;
  }
}
