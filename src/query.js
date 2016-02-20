import SearchResult from './search-result';

/**
 * Encapsulate matching condition between a Strategy and current editor's value.
 */
export default class Query {
  /**
   * @param {Strategy} strategy
   * @param {string} term
   * @param {string[]} match
   */
  constructor(strategy, term, match) {
    this.strategy = strategy;
    this.term = term;
    this.match = match;
  }

  /**
   * Invoke search strategy and callback the given function.
   *
   * @public
   * @param {function} callback
   */
  execute(callback) {
    this.strategy.search(
      this.term,
      results => {
        callback(results.map(result => {
          return new SearchResult(result, this.term, this.strategy);
        }));
      },
      this.match
    );
  }
}
