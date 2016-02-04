import {NO_RESULT} from './textcomplete';

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
   * @param {string} text - Head to input cursor.
   * @param {Textcomplete#handleQueryResult} callback
   */
  execute(text, callback) {
    var query = this.extractQuery(text);
    if (query) {
      // TODO
    } else {
      callback(NO_RESULT);
    }
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
