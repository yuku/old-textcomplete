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
   * @returns {string}
   */
  render() {
    return this.strategy.template(this.data, this.term);
  }
}
