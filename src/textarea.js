/**
 * Encapsulate the target textarea element.
 */
export default class Textarea {
  /**
   * @param {HTMLTextAreaElement} el - Where the textcomplete works on.
   * @param {Textcomplete} textcomplete
   */
  constructor(el, textcomplete) {
    this.el = el;
    this.textcomplete = textcomplete;
    this.el.addEventListener('keyup', () => {
      this.textcomplete.trigger(this.getText());
    });
  }

  /**
   * Returns the string from head to current input cursor position.
   *
   * @private
   * @returns {string}
   */
  getText() {
    return this.el.value.substring(0, this.el.selectionEnd);
  }
}
