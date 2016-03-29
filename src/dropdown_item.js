import uniqueId from 'lodash.uniqueid';
import bindAll from 'lodash.bindall';

export const CLASS_NAME = 'textcomplete-item';
const ACTIVE_CLASS_NAME = `${CLASS_NAME} active`;
const CALLBACK_METHODS = ['onClick', 'onMouseover'];

/**
 * Encapsulate an item of dropdown.
 */
class DropdownItem {
  /**
   * @param {SearchResult} searchResult
   */
  constructor(searchResult) {
    this.searchResult = searchResult;
    this.id = uniqueId('dropdown-item-');
    this.active = false;

    bindAll(this, CALLBACK_METHODS);
  }

  /**
   * @public
   * @returns {HTMLLIElement}
   */
  get el() {
    if (!this._el) {
      const li = document.createElement('li');
      li.id = this.id;
      li.className = this.active ? ACTIVE_CLASS_NAME : CLASS_NAME;
      const a = document.createElement('a');
      a.innerHTML = this.searchResult.render();
      li.appendChild(a);
      this._el = li;
      li.addEventListener('mousedown', this.onClick);
      li.addEventListener('mouseover', this.onMouseover);
      li.addEventListener('touchstart', this.onClick);
    }
    return this._el;
  }

  /**
   * Try to free resources and perform other cleanup operations.
   *
   * @public
   */
  finalize() {
    this.el.removeEventListener('mousedown', this.onClick, false);
    this.el.removeEventListener('mouseover', this.onMouseover, false);
    this.el.removeEventListener('touchstart', this.onClick, false);
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
  }

  /**
   * Deactivate active item then activate itself.
   *
   * @public
   * @returns {this}
   */
  activate() {
    if (!this.active) {
      const activeItem = this.dropdown.getActiveItem();
      if (activeItem) {
        activeItem.deactivate();
      }
      this.active = true;
      this.el.className = ACTIVE_CLASS_NAME;
    }
    return this;
  }

  /**
   * Get the next sibling.
   *
   * @public
   * @returns {?DropdownItem}
   */
  get next() {
    let nextIndex;
    if (this.index === this.siblings.length - 1) {
      if (!this.dropdown.rotate) {
        return null;
      }
      nextIndex = 0;
    } else {
      nextIndex = this.index + 1;
    }
    return this.siblings[nextIndex];
  }

  /**
   * Get the previous sibling.
   *
   * @public
   * @returns {DropdownItem}
   */
  get prev() {
    let nextIndex;
    if (this.index === 0) {
      if (!this.dropdown.rotate) {
        return null;
      }
      nextIndex = this.siblings.length - 1;
    } else {
      nextIndex = this.index - 1;
    }
    return this.siblings[nextIndex];
  }

  /**
   * @private
   * @returns {this}
   */
  deactivate() {
    if (this.active) {
      this.active = false;
      this.el.className = CLASS_NAME;
    }
    return this;
  }

  /**
   * @private
   * @param {MouseEvent} e
   */
  onClick(e) {
    e.preventDefault(); // Prevent blur event
    this.dropdown.select(this);
  }

  /**
   * @private
   * @param {MouseEvent} _e
   */
  onMouseover(_e) {
    this.activate();
  }
}

export default DropdownItem;
