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
  }

  /**
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
   */
  render(_searchResults) {
  }

  /**
   * Hide the dropdown then sweep out items.
   */
  deactivate() {
  }
}
