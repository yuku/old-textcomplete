import {EventEmitter} from 'events';

const CALLBACK_METHODS = ['handleQueryResult'];

export default class Completer extends EventEmitter {
  constructor() {
    super();
    this.strategies = [];

    // Bind callback methods
    CALLBACK_METHODS.forEach(name => {
      this[name] = this[name].bind(this);
    });
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
    var query = this.extractQuery(text);
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
    var i;
    for (i = 0; i < this.strategies.length; i++) {
      let query = this.strategies[i].buildQuery(text);
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
