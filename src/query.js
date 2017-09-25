// @flow

import SearchResult from "./search_result"
import Strategy from "./strategy"

declare class MatchData extends Array<string> {
  index: number,
}

export type { MatchData }

/**
 * Encapsulate matching condition between a Strategy and current editor's value.
 */
export default class Query {
  strategy: Strategy
  term: string
  match: MatchData

  constructor(strategy: Strategy, term: string, match: MatchData) {
    this.strategy = strategy
    this.term = term
    this.match = match
  }

  /**
   * Invoke search strategy and callback the given function.
   */
  execute(callback: (SearchResult[]) => void) {
    this.strategy.search(
      this.term,
      results => {
        callback(
          results.map(result => {
            return new SearchResult(result, this.term, this.strategy)
          }),
        )
      },
      this.match,
    )
  }
}
