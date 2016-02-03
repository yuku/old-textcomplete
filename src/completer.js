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
}
