import Editor from './editor';

import {ENTER, UP, DOWN} from './textcomplete';

const getCaretCoordinates = require('textarea-caret');

const CALLBACK_METHODS = ['onKeydown', 'onKeyup'];

/**
 * Encapsulate the target textarea element.
 */
export default class Textarea extends Editor {
  /**
   * @param {HTMLTextAreaElement} el - Where the textcomplete works on.
   */
  constructor(el) {
    super();
    this.el = el;

    // Bind callback methods
    CALLBACK_METHODS.forEach(name => {
      this[name] = this[name].bind(this);
    });

    this.el.addEventListener('keydown', this.onKeydown);
    this.el.addEventListener('keyup', this.onKeyup);
  }

  /**
   * @override
   * @param {SearchResult} searchResult
   */
  applySearchResult(searchResult) {
    var replace = searchResult.replace(this.beforeCursor, this.afterCursor);
    if (Array.isArray(replace)) {
      this.el.value = replace[0] + replace[1];
      this.el.selectionStart = this.el.selectionEnd = replace[0].length;
    }
  }

  /**
   * @override
   * @returns {{top: number, left: number}}
   */
  get cursorOffset() {
    var elOffset = this.getElOffset();
    var elScroll = this.getElScroll();
    var cursorPosition = this.getCursorPosition();
    return {
      top: elOffset.top - elScroll.top + cursorPosition.top + this.getElLineHeight(),
      left: elOffset.left - elScroll.left + cursorPosition.left,
    };
  }

  /**
   * The string from head to current input cursor position.
   *
   * @private
   * @returns {string}
   */
  get beforeCursor() {
    return this.el.value.substring(0, this.el.selectionEnd);
  }

  /**
   * @private
   * @returns {string}
   */
  get afterCursor() {
    return this.el.value.substring(this.el.selectionEnd);
  }

  /**
   * Get the current coordinates of the `#el` relative to the document.
   *
   * @private
   * @returns {{top: number, left: number}}
   */
  getElOffset() {
    var rect = this.el.getBoundingClientRect();
    var documentElement = this.el.ownerDocument.documentElement;
    return {
      top: rect.top - documentElement.clientTop,
      left: rect.left - documentElement.clientLeft,
    };
  }

  /**
   * @private
   * @returns {{top: number, left: number}}
   */
  getElScroll() {
    return { top: this.el.scrollTop, left: this.el.scrollLeft };
  }

  /**
   * The input cursor's relative coordinates from the textarea's left
   * top corner.
   *
   * @private
   * @returns {{top: number, left: number}}
   */
  getCursorPosition() {
    // textarea-caret throws an error if `window` is undefined.
    return typeof window !== 'undefined' ?
      getCaretCoordinates(this.el, this.el.selectionEnd) : { top: 0, left: 0 };
  }

  /**
   * @private
   * @returns {number}
   */
  getElLineHeight() {
    var computed = document.defaultView.getComputedStyle(this.el);
    var lineHeight = parseInt(computed.lineHeight, 10);
    return isNaN(lineHeight) ? parseInt(computed.fontSize, 10) : lineHeight;
  }

  /**
   * @private
   * @param {KeyboardEvent} e
   */
  onKeydown(e) {
    var code = e.keyCode === 13 ? ENTER
             : e.keyCode === 38 ? UP
             : e.keyCode === 40 ? DOWN
             : e.keyCode === 78 && e.ctrlKey ? DOWN
             : e.keyCode === 80 && e.ctrlKey ? UP
             : null;
    if (code) {
      this.textcomplete.handleMoveKeydown(code, function () {
        e.preventDefault();
      });
    }
  }

  /**
   * @private
   * @param {KeyboardEvent} e
   */
  onKeyup(e) {
    this.textcomplete.trigger(this.skipTrigger(e) ? null : this.beforeCursor);
  }

  /**
   * @private
   * @param {KeyboardEvent} e
   * @returns {boolean}
   */
  skipTrigger(e) {
    switch (e.keyCode) {
    case 13: // enter
    case 38: // up
    case 40: // down
      return true;
    case 78: // n
    case 80: // p
      return e.ctrlKey;
    default:
      return false;
    }
  }
}
