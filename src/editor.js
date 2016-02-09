/**
 * Abstract class representing a editor target.
 *
 * @abstract
 */
export default class Editor {
  /**
   * Set a textcomplete without overriding existing one.
   *
   * @throws {Error} If a textcomplete has already been assigned.
   * @param {Textcomplete} textcomplete
   * @returns {this}
   */
  registerTextcomplete(textcomplete) {
    if (this.textcomplete) {
      throw new Error('Textcomplete has already been registered.');
    }
    this.textcomplete = textcomplete;
    return this;
  }

  /**
   * The input cursor's absolute coordinates from the window's left
   * top corner.
   *
   * @returns {{top: number, left: number}}
   */
  get cursorOffset() {
    throw new Error('Not implemented.');
  }
}
