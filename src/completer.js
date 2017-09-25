// @flow

import EventEmitter from "eventemitter3"

import Strategy from "./strategy"
import SearchResult from "./search_result"

const CALLBACK_METHODS = ["handleQueryResult"]

/**
 * Complete engine.
 */
export default class Completer extends EventEmitter {
  strategies: Strategy[]

  constructor() {
    super()
    this.strategies = []

    CALLBACK_METHODS.forEach(method => {
      ;(this: any)[method] = (this: any)[method].bind(this)
    })
  }

  /**
   * @return {this}
   */
  destroy() {
    this.strategies.forEach(strategy => strategy.destroy())
    return this
  }

  /**
   * Register a strategy to the completer.
   *
   * @return {this}
   */
  registerStrategy(strategy: Strategy) {
    this.strategies.push(strategy)
    return this
  }

  /**
   * @param {string} text - Head to input cursor.
   */
  run(text: string): void {
    const query = this.extractQuery(text)
    if (query) {
      query.execute(this.handleQueryResult)
    } else {
      this.handleQueryResult([])
    }
  }

  /**
   * Find a query, which matches to the given text.
   *
   * @private
   */
  extractQuery(text: string) {
    for (let i = 0; i < this.strategies.length; i++) {
      const query = this.strategies[i].buildQuery(text)
      if (query) {
        return query
      }
    }
    return null
  }

  /**
   * Callbacked by {@link Query#execute}.
   *
   * @private
   */
  handleQueryResult(searchResults: SearchResult[]) {
    this.emit("hit", { searchResults })
  }
}
