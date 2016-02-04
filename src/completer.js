export default class Completer {
  constructor() {
    this.strategies = [];
  }

  /**
   * Register a strategy to the completer.
   *
   * @param {Strategy} strategy
   * @returns {this}
   */
  registerStrategy(strategy) {
    this.strategies.push(strategy);
    return this;
  }

  /**
   * @private
   * @param {string} text - Head to input cursor.
   * @returns {?Query}
   */
  extractQuery(text) {
    var i;
    for (i = 0; i < this.strategies.length; i++) {
      let query = this.strategies[i].buildQuery(text);
      if (query) { return query; }
    }
    return null;
  }
}
