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
   * It is called when a search result is selected by a user.
   *
   * @param {SearchResult} _searchResult
   */
  applySearchResult(_searchResult) {
    throw new Error('Not implemented.');
  }

  /**
   * The input cursor's absolute coordinates from the window's left
   * top corner. It is intended to be overridden by sub classes and
   * returns `{top: number, left: number}` object.
   */
  get cursorOffset() {
    throw new Error('Not implemented.');
  }
}
