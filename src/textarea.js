import Editor, {ENTER, DOWN, UP, META} from './editor';
import {calculateElementOffset} from './utils';

import bindAll from 'lodash.bindall';
import lineHeight from 'line-height';

const getCaretCoordinates = require('textarea-caret');

const CALLBACK_METHODS = ['onKeydown', 'onKeyup'];

/**
 * Encapsulate the target textarea element.
 *
 * @extends Editor
 * @prop {HTMLTextAreaElement} el - Where the textcomplete works on.
 */
class Textarea extends Editor {
  /**
   * @param {HTMLTextAreaElement} el
   */
  constructor(el) {
    super();
    this.el = el;

    bindAll(this, CALLBACK_METHODS);

    this.startListening();
  }

  /** @override */
  finalize() {
    super.finalize();
    this.stopListening();
    this.el = null;
    return this;
  }

  /**
   * @override
   * @param {SearchResult} searchResult
   */
  applySearchResult(searchResult) {
    const replace = searchResult.replace(this.getBeforeCursor(), this.getAfterCursor());
    if (Array.isArray(replace)) {
      this.el.value = replace[0] + replace[1];
      this.el.selectionStart = this.el.selectionEnd = replace[0].length;
    }
    this.el.focus(); // Clicking a dropdown item removes focus from the element.
  }

  getCursorOffset() {
    const elOffset = calculateElementOffset(this.el);
    const elScroll = this.getElScroll();
    const cursorPosition = this.getCursorPosition();
    const top = elOffset.top - elScroll.top + cursorPosition.top + lineHeight(this.el);
    const left = elOffset.left - elScroll.left + cursorPosition.left;
    if (this.el.dir !== 'rtl') {
      return { top, left };
    } else {
      return { top: top, right: document.documentElement.clientWidth - left };
    }
  }

  /** @override */
  getBeforeCursor() {
    return this.el.value.substring(0, this.el.selectionEnd);
  }

  /** @override */
  getAfterCursor() {
    return this.el.value.substring(this.el.selectionEnd);
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
    return getCaretCoordinates(this.el, this.el.selectionEnd);
  }

  /**
   * @private
   * @fires Editor#move
   * @param {KeyboardEvent} e
   */
  onKeydown(e) {
    const code = this.getCode(e);
    let event;
    switch (code) {
      case UP:
      case DOWN:
        event = this.emitMoveEvent(code);
        break;
      case ENTER: {
        event = this.emitEnterEvent();
        break;
      }
    }
    if (event && event.defaultPrevented) {
      e.preventDefault();
    }
  }

  /**
   * @private
   * @fires Editor#change
   * @param {KeyboardEvent} e
   */
  onKeyup(e) {
    const code = this.getCode(e);
    switch (code) {
      case DOWN:
      case UP:
      case META:
        return;
      default:
        this.emitChangeEvent();
    }
  }

  /**
   * @private
   */
  startListening() {
    this.el.addEventListener('keydown', this.onKeydown);
    this.el.addEventListener('keyup', this.onKeyup);
  }

  /**
   * @private
   */
  stopListening() {
    this.el.removeEventListener('keydown', this.onKeydown);
    this.el.removeEventListener('keyup', this.onKeyup);
  }
}

export default Textarea;
