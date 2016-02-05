export default class SearchResult {
  /**
   * @param {object} data - An element of array callbacked by search function.
   * @param {Strategy} strategy
   */
  constructor(data, strategy) {
    this.data = data;
    this.strategy = strategy;
  }
}
