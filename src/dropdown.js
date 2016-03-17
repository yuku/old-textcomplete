import DropdownItem from './dropdown_item';
import {createFragment, createCustomEvent} from './utils';

import extend from 'lodash.assignin';
import uniqueId from 'lodash.uniqueid';
import isFunction from 'lodash.isfunction';
import {EventEmitter} from 'events';

const DEFAULT_CLASS_NAME = 'dropdown-menu textcomplete-dropdown';

/**
 * @typedef {Object} Dropdown~Offset
 * @prop {number} [top]
 * @prop {number} [left]
 * @prop {number} [right]
 */

/**
 * @typedef {Object} Dropdown~Options
 * @prop {string} [className]
 * @prop {function|string} [footer]
 * @prop {function|string} [header]
 * @prop {number} [maxCount]
 * @prop {Object} [style]
 */

/**
 * @event Dropdown#render
 * @type {CustomEvent}
 * @prop {function} preventDefault
 */

/**
 * @event Dropdown#rendered
 * @type {CustomEvent}
 */

/**
 * @event Dropdown#select
 * @type {CustomEvent}
 * @prop {function} preventDefault
 * @prop {object} detail
 * @prop {SearchResult} detail.searchResult
 */

/**
 * @event Dropdown#selected
 * @type {CustomEvent}
 * @prop {object} detail
 * @prop {SearchResult} detail.searchResult
 */

/**
 * @event Dropdown#show
 * @type {CustomEvent}
 * @prop {function} preventDefault
 */

/**
 * @event Dropdown#shown
 * @type {CustomEvent}
 */

/**
 * @event Dropdown#hide
 * @type {CustomEvent}
 * @prop {function} preventDefault
 */

/**
 * @event Dropdown#hidden
 * @type {CustomEvent}
 */

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
    el.id = uniqueId('textcomplete-dropdown-');
    extend(el.style, {
      display: 'none',
      position: 'absolute',
      zIndex: 10000,
    });
    document.body.appendChild(el);
    return el;
  }

  /**
   * @param {string} [className=DEFAULT_CLASS_NAME] - The class attribute of the el.
   * @param {function|string} [footer]
   * @param {function|string} [header]
   * @param {number} [maxCount=10]
   * @param {Object} [style] - The style of the el.
   */
  constructor({className=DEFAULT_CLASS_NAME, footer, header, maxCount=10, style}) {
    super();
    this.shown = false;
    this.items = [];
    this.footer = footer;
    this.header = header;
    this.maxCount = maxCount;
    this.el.className = className;
    if (style) {
      extend(this.el.style, style);
    }
  }

  /**
   * @returns {this}
   */
  finalize() {
    this.el.parentNode.removeChild(this.el);
    this.clear()._el = null;
    return this;
  }

  /**
   * @returns {HTMLUListElement} the dropdown element.
   */
  get el() {
    this._el || (this._el = Dropdown.createElement());
    return this._el;
  }

  /**
   * Render the given data as dropdown items.
   *
   * @param {SearchResult[]} searchResults
   * @param {Dropdown~Offset} cursorOffset
   * @returns {this}
   * @fires Dropdown#render
   * @fires Dropdown#rendered
   */
  render(searchResults, cursorOffset) {
    let renderEvent = createCustomEvent('render', { cancelable: true });
    this.emit('render', renderEvent);
    if (renderEvent.defaultPrevented) {
      return this;
    }
    let rawResults = [], dropdownItems = [];
    searchResults.forEach(searchResult => {
      rawResults.push(searchResult.data);
      if (dropdownItems.length < this.maxCount) {
        dropdownItems.push(new DropdownItem(searchResult));
      }
    });
    this.clear()
        .renderEdge(rawResults, 'header')
        .append(dropdownItems)
        .renderEdge(rawResults, 'footer')
        .setOffset(cursorOffset)
        .show();
    this.emit('rendered', createCustomEvent('rendered'));
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
   * @param {DropdownItem} dropdownItem
   * @returns {this}
   * @fires Dropdown#select
   */
  select(dropdownItem) {
    let detail = { searchResult: dropdownItem.searchResult };
    let selectEvent = createCustomEvent('select', { cancelable: true, detail: detail });
    this.emit('select', selectEvent);
    if (selectEvent.defaultPrevented) {
      return this;
    }
    this.deactivate();
    this.emit('selected', createCustomEvent('selected', {detail}));
    return this;
  }

  /**
   * @param {Editor#move} e
   * @returns {this}
   */
  up(e) {
    return this.shown ? this.moveActiveItem('prev', e) : this;
  }

  /**
   * @param {Editor#move} e
   * @returns {this}
   */
  down(e) {
    return this.shown ? this.moveActiveItem('next', e) : this;
  }

  /**
   * Retrieve the active item.
   *
   * @returns {DropdownItem|undefined}
   */
  getActiveItem() {
    return this.items.find(item => item.active);
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
    items.forEach(item => {
      this.items.push(item);
      item.appended(this);
      fragment.appendChild(item.el);
    });
    this.el.appendChild(fragment);
    return this;
  }

  /**
   * @private
   * @param {Dropdown~Offset} cursorOffset
   * @returns {this}
   */
  setOffset(cursorOffset) {
    ['top', 'right', 'bottom', 'left'].forEach(name => {
      if (cursorOffset.hasOwnProperty(name)) {
        this.el.style[name] = `${cursorOffset[name]}px`;
      }
    });
    return this;
  }

  /**
   * Show the element.
   *
   * @private
   * @returns {this}
   * @fires Dropdown#show
   * @fires Dropdown#shown
   */
  show() {
    if (!this.shown) {
      let showEvent = createCustomEvent('show', { cancelable: true });
      this.emit('show', showEvent);
      if (showEvent.defaultPrevented) {
        return this;
      }
      this.el.style.display = 'block';
      this.shown = true;
      this.emit('shown', createCustomEvent('shown'));
    }
    return this;
  }

  /**
   * Hide the element.
   *
   * @private
   * @returns {this}
   * @fires Dropdown#hide
   * @fires Dropdown#hidden
   */
  hide() {
    if (this.shown) {
      let hideEvent = createCustomEvent('hide', { cancelable: true });
      this.emit('hide', hideEvent);
      if (hideEvent.defaultPrevented) {
        return this;
      }
      this.el.style.display = 'none';
      this.shown = false;
      this.emit('hidden', createCustomEvent('hidden'));
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
    this.items.forEach(item => item.finalize());
    this.items = [];
    return this;
  }

  /**
   * @private
   * @param {string} name - "next" or "prev".
   * @param {Editor#move} e
   * @returns {this}
   */
  moveActiveItem(name, e) {
    let activeItem = this.getActiveItem();
    let nextActiveItem;
    if (activeItem) {
      activeItem.deactivate();
      nextActiveItem = activeItem[name];
    } else {
      nextActiveItem = name === 'next' ? this.items[0] : this.items[this.items.length - 1];
    }
    if (nextActiveItem) {
      nextActiveItem.activate();
      e.preventDefault();
    }
    return this;
  }

  /**
   * @private
   * @param {object[]} rawResults - What callbacked by search function.
   * @param {string} type - 'header' or 'footer'.
   * @returns {this}
   */
  renderEdge(rawResults, type) {
    var source = this[type];
    if (source) {
      let content = isFunction(source) ? source(rawResults) : source;
      let fragment = createFragment(`<li class="textcomplete-${type}">${content}</li>`);
      this.el.appendChild(fragment);
    }
    return this;
  }
}

export default Dropdown;
