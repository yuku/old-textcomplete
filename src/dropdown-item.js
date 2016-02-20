import {uniqueId} from 'lodash';

const INACTIVE_CLASS_NAME = 'textcomplete-item';
const ACTIVE_CLASS_NAME = `${INACTIVE_CLASS_NAME} active`;
const CALLBACK_METHODS = ['onClick'];

/**
 * Encapsulate an item of dropdown.
 */
export default class DropdownItem {
  /**
   * @param {SearchResult} searchResult
   */
  constructor(searchResult) {
    this.searchResult = searchResult;
    this.id = uniqueId('dropdown-item-');
    this.active = false;

    CALLBACK_METHODS.forEach(name => {
      this[name] = this[name].bind(this);
    });
  }

  /**
   * @public
   * @returns {HTMLLIElement}
   */
  get el() {
    if (!this._el) {
      let li = document.createElement('li');
      li.id = this.id;
      li.className = this.active ? ACTIVE_CLASS_NAME : INACTIVE_CLASS_NAME;
      let a = document.createElement('a');
      a.innerHTML = this.searchResult.render();
      li.appendChild(a);
      this._el = li;
      li.addEventListener('click', this.onClick);
    }
    return this._el;
  }

  /**
   * Try to free resources and perform other cleanup operations.
   *
   * @public
   */
  finalize() {
    this._el.removeEventListener('click', this.onClick, false);
    // This element has already been removed by `Dropdown#clear`.
    this._el = null;
  }

  /**
   * Callbacked when it is appended to a dropdown.
   *
   * @public
   * @param {Dropdown} dropdown
   * @see Dropdown#append
   */
  appended(dropdown) {
    this.dropdown = dropdown;
    this.siblings = dropdown.items;
    this.index = this.siblings.length - 1;
    if (this.index === 0) {
      this.activate();
    }
  }

  /**
   * @public
   * @returns {this}
   */
  activate() {
    if (!this.active) {
      this.active = true;
      this.el.className = ACTIVE_CLASS_NAME;
    }
    return this;
  }

  /**
   * @public
   * @returns {this}
   */
  deactivate() {
    if (this.active) {
      this.active = false;
      this.el.className = INACTIVE_CLASS_NAME;
    }
    return this;
  }

  /**
   * Get the next sibling.
   *
   * @public
   * @returns {DropdownItem}
   */
  get next() {
    var nextIndex = (this.index === this.siblings.length - 1 ? 0 : this.index + 1);
    return this.siblings[nextIndex];
  }

  /**
   * Get the previous sibling.
   *
   * @public
   * @returns {DropdownItem}
   */
  get prev() {
    var prevIndex = (this.index === 0 ? this.siblings.length : this.index) - 1;
    return this.siblings[prevIndex];
  }

  /**
   * @private
   * @param {MouseEvent} _e
   */
  onClick(_e) {
    this.dropdown.select(this);
  }
}
