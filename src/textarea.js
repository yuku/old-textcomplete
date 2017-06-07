// @flow

import Editor from './editor';
import {calculateElementOffset, getLineHeightPx} from './utils';
import SearchResult from './search_result';

const getCaretCoordinates = require('textarea-caret');

const CALLBACK_METHODS = ['onInput', 'onKeydown'];

/**
 * Encapsulate the target textarea element.
 *
 * @extends Editor
 * @prop {HTMLTextAreaElement} el - Where the textcomplete works on.
 */
export default class Textarea extends Editor {
  el: HTMLTextAreaElement;

  /**
   * @param {HTMLTextAreaElement} el
   */
  constructor(el: HTMLTextAreaElement) {
    super();
    this.el = el;

    CALLBACK_METHODS.forEach((method) => {
      (this: any)[method] = (this: any)[method].bind(this);
    });

    this.startListening();
  }

  /** @override */
  destroy() {
    super.destroy();
    this.stopListening();
    // Release the element reference early to help garbage collection.
    (this: any).el = null;
    return this;
  }

  /**
   * @override
   * @param {SearchResult} searchResult
   */
  applySearchResult(searchResult: SearchResult) {
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
    const lineHeight = getLineHeightPx(this.el);
    const top = elOffset.top - elScroll.top + cursorPosition.top + lineHeight;
    const left = elOffset.left - elScroll.left + cursorPosition.left;
    if (this.el.dir !== 'rtl') {
      return { top, left, lineHeight };
    } else if (document.documentElement) {
      const right = document.documentElement.clientWidth - left;
      return { top, right, lineHeight };
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
   * @fires Editor#change
   * @param {InputEvent} _e
   */
  onInput(_e: Event) {
    this.emitChangeEvent();
  }

  /**
   * @private
   * @fires Editor#move
   * @param {KeyboardEvent} e
   */
  onKeydown(e: KeyboardEvent) {
    const code = this.getCode(e);
    let event;
    if (code === 'UP' || code === 'DOWN') {
      event = this.emitMoveEvent(code);
    } else if (code === 'ENTER') {
      event = this.emitEnterEvent();
    } else if (code === 'ESC') {
      event = this.emitEscEvent();
    }
    if (event && event.defaultPrevented) {
      e.preventDefault();
    }
  }

  /**
   * @private
   */
  startListening() {
    this.el.addEventListener('input', this.onInput);
    this.el.addEventListener('keydown', this.onKeydown);
  }

  /**
   * @private
   */
  stopListening() {
    this.el.removeEventListener('input', this.onInput);
    this.el.removeEventListener('keydown', this.onKeydown);
  }
}
