import SearchResult from './search-result';
import {STILL_SEARCHING, SEARCH_COMPLETED} from './textcomplete';

/**
 * Encapsulate matching condition between a Strategy and current textarea's value.
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
   * @param {Textcomplete#handleQueryResult} callback
   */
  execute(callback) {
    this.strategy.search(this.term, (results, stillSearching) => {
      callback(
        stillSearching ? STILL_SEARCHING : SEARCH_COMPLETED,
        results.map((result) => { return new SearchResult(result, this.term, this.strategy); })
      );
    }, this.match);
  }
}
