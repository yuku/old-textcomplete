export default class SearchResult {
  /**
   * @param {object} data - An element of array callbacked by search function.
   * @param {string} term
   * @param {Strategy} strategy
   */
  constructor(data, term, strategy) {
    this.data = data;
    this.term = term;
    this.strategy = strategy;
  }

  /**
   * @param {string} beforeCursor
   * @param {string} afterCursor
   * @returns {string[]|undefined}
   */
  replace(beforeCursor, afterCursor) {
    var replacement = this.strategy.replace(this.data);
    if (replacement != null) {
      if (Array.isArray(replacement)) {
        afterCursor = replacement[1] + afterCursor;
        replacement = replacement[0];
      }
      return [beforeCursor.replace(this.strategy.match, replacement), afterCursor];
    }
  }

  /**
   * @returns {string}
   */
  render() {
    return this.strategy.template(this.data, this.term);
  }
}
