/**
 * Encapsulate an item of dropdown.
 */
export default class DropdownItem {
  /**
   * @param {SearchResult} searchResult
   */
  constructor(searchResult) {
    this.searchResult = searchResult;
  }

  /**
   * @returns {HTMLLIElement}
   */
  get el() {
    if (!this._el) {
      var li = document.createElement('li');
      li.className = 'textcomplete-item';
      var a = document.createElement('a');
      a.innerHTML = ''; // TODO imprement
      li.appendChild(a);
      this._el = li;
    }
    return this._el;
  }

  finalize() {
    // This element has already been removed by `Dropdown#clear`.
    this._el = null;
  }
}
