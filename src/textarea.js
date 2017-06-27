// @flow

import Editor from './editor';
import {calculateElementOffset, getLineHeightPx} from './utils';
import SearchResult from './search_result';

const getCaretCoordinates = require('textarea-caret');

const CALLBACK_METHODS = ['onInput', 'onKeydown'];

/**
 * Encapsulate the target textarea element.
 */
export default class Textarea extends Editor {
  el: HTMLTextAreaElement;

  /**
   * @param {HTMLTextAreaElement} el - Where the textcomplete works on.
   */
  constructor(el: HTMLTextAreaElement) {
    super();
    this.el = el;

    CALLBACK_METHODS.forEach((method) => {
      (this: any)[method] = (this: any)[method].bind(this);
    });

    this.startListening();
  }

  /**
   * @return {this}
   */
  destroy() {
    super.destroy();
    this.stopListening();
    // Release the element reference early to help garbage collection.
    (this: any).el = null;
    return this;
  }

  /**
   * Implementation for {@link Editor#applySearchResult}
   */
  applySearchResult(searchResult: SearchResult) {
    const replace = searchResult.replace(this.getBeforeCursor(), this.getAfterCursor());
    this.el.focus(); // Clicking a dropdown item removes focus from the element.
    if (Array.isArray(replace)) {
      const curr = this.el.value; // strA + strB1 + strC
      const next = replace[0] + replace[1]; // strA + strB2 + strC

      //  Calculate length of strA and strC
      let aLength = 0;
      while (curr[aLength] === next[aLength]) { aLength++; }
      let cLength = 0;
      while (curr[curr.length - cLength - 1] === next[next.length - cLength - 1]) { cLength++; }

      // Select strB1
      this.el.setSelectionRange(aLength, curr.length - cLength);

      // Replace strB1 with strB2
      const strB2 = next.substring(aLength, next.length - cLength);
      if (!document.execCommand('insertText', false, strB2)) {
        // Document.execCommand returns false if the command is not supported.
        // Firefox returns false in this case.
        this.el.value = next;
      }

      // Move cursor
      this.el.selectionStart = this.el.selectionEnd = replace[0].length;

      this.el.dispatchEvent(new Event('input'));
    }
  }

  /**
   * Implementation for {@link Editor#getCursorOffset}
   */
  getCursorOffset() {
    const elOffset = calculateElementOffset(this.el);
    const elScroll = this.getElScroll();
    const cursorPosition = this.getCursorPosition();
    const lineHeight = getLineHeightPx(this.el);
    const top = elOffset.top - elScroll.top + cursorPosition.top + lineHeight;
    const left = elOffset.left - elScroll.left + cursorPosition.left;
    if (this.el.dir !== 'rtl') {
      return { top, left, lineHeight };
    } else {
      const right = document.documentElement ? document.documentElement.clientWidth - left : 0;
      return { top, right, lineHeight };
    }
  }

  /**
   * Implementation for {@link Editor#getBeforeCursor}
   */
  getBeforeCursor() {
    return this.el.value.substring(0, this.el.selectionEnd);
  }

  /**
   * Implementation for {@link Editor#getAfterCursor}
   */
  getAfterCursor() {
    return this.el.value.substring(this.el.selectionEnd);
  }

  /** @private */
  getElScroll(): { top: number; left: number; } {
    return { top: this.el.scrollTop, left: this.el.scrollLeft };
  }

  /**
   * The input cursor's relative coordinates from the textarea's left
   * top corner.
   *
   * @private
   */
  getCursorPosition(): { top: number; left: number; } {
    return getCaretCoordinates(this.el, this.el.selectionEnd);
  }

  /** @private */
  onInput(_: Event) {
    this.emitChangeEvent();
  }

  /** @private */
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

  /** @private */
  startListening() {
    this.el.addEventListener('input', this.onInput);
    this.el.addEventListener('keydown', this.onKeydown);
  }

  /** @private */
  stopListening() {
    this.el.removeEventListener('input', this.onInput);
    this.el.removeEventListener('keydown', this.onKeydown);
  }
}
