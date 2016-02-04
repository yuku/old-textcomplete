/**
 * Encapsulate matching condition between a Strategy and current textarea's value.
 */
export default class Query {
  constructor(strategy, term, match) {
    this.strategy = strategy;
    this.term = term;
    this.match = match;
  }
}
