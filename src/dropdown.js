/**
 * Encapsulate a dropdown view.
 */
export default class Dropdown {
  constructor() {
    this.el = null;
    this.shown = false;
  }

  /**
   * Render the given data as dropdown items.
   *
   * @param {SearchResult[]} _searchResults
   */
  render(_searchResults) {
  }

  /**
   * Hide the dropdown then sweep out items.
   */
  deactivate() {
  }
}
