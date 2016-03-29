import bindAll from 'lodash.bindall';
import {EventEmitter} from 'events';

const CALLBACK_METHODS = ['handleQueryResult'];

/**
 * @extends EventEmitter
 */
class Completer extends EventEmitter {
  constructor() {
    super();
    this.strategies = [];

    bindAll(this, CALLBACK_METHODS);
  }

  /**
   * @returns {this}
   */
  finalize() {
    this.strategies.forEach(strategy => strategy.finalize());
    return this;
  }

  /**
   * Register a strategy to the completer.
   *
   * @public
   * @param {Strategy} strategy
   * @returns {this}
   */
  registerStrategy(strategy) {
    this.strategies.push(strategy);
    return this;
  }

  /**
   * @public
   * @param {string} text - Head to input cursor.
   * @fires Completer#hit
   */
  run(text) {
    const query = this.extractQuery(text);
    if (query) {
      query.execute(this.handleQueryResult);
    } else {
      this.handleQueryResult([]);
    }
  }

  /**
   * Find a query, which matches to the given text.
   *
   * @private
   * @param {string} text - Head to input cursor.
   * @returns {?Query}
   */
  extractQuery(text) {
    for (let i = 0; i < this.strategies.length; i++) {
      const query = this.strategies[i].buildQuery(text);
      if (query) { return query; }
    }
    return null;
  }

  /**
   * Callbacked by Query#execute.
   *
   * @private
   * @param {SearchResult[]} searchResults
   */
  handleQueryResult(searchResults) {
    /**
     * @event Completer#hit
     * @type {object}
     * @prop {SearchResult[]} searchResults
     */
    this.emit('hit', { searchResults });
  }
}

export default Completer;
