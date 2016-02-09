import Editor from './editor';

const getCaretCoordinates = require('textarea-caret');

const CALLBACK_METHODS = ['onKeyup'];

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

    this.el.addEventListener('keyup', this.onKeyup);
  }

  /** @inheritdoc */
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
  get text() {
    return this.el.value.substring(0, this.el.selectionEnd);
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
   * @param {KeyboardEvent} _e
   */
  onKeyup(_e) {
    this.textcomplete.trigger(this.text);
  }
}
