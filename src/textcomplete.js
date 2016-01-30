import Strategy from './strategy';

export default class Textcomplete {
  constructor() {
    this.strategies = [];
  }

  /**
   * @param {Object[]} strategies
   */
  register(strategies) {
    strategies.forEach((strategy) => {
      this.strategies.push(new Strategy(strategy));
    });
  }
}
