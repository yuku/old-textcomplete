// @flow

import Query from "./query"
import type { MatchData } from "./query"

const DEFAULT_INDEX = 2

function DEFAULT_TEMPLATE(value) {
  return value
}

/**
 * Properties for a strategy.
 *
 * @typedef
 */
export type StrategyProperties = {
  match: RegExp | (string => MatchData | null),
  search: Function,
  replace: any => string[] | string | null,
  cache?: boolean,
  context?: Function,
  template?: any => string,
  index?: number,
  id?: string,
}

/**
 * Encapsulate a single strategy.
 */
export default class Strategy {
  props: StrategyProperties
  cache: ?Object

  constructor(props: StrategyProperties) {
    this.props = props
    this.cache = props.cache ? {} : null
  }

  /**
   * @return {this}
   */
  destroy() {
    this.cache = null
    return this
  }

  /**
   * Build a Query object by the given string if this matches to the string.
   *
   * @param {string} text - Head to input cursor.
   */
  buildQuery(text: string): ?Query {
    if (typeof this.props.context === "function") {
      const context = this.props.context(text)
      if (typeof context === "string") {
        text = context
      } else if (!context) {
        return null
      }
    }
    const match = this.matchText(text)
    return match ? new Query(this, match[this.index], match) : null
  }

  search(term: string, callback: Function, match: MatchData): void {
    if (this.cache) {
      this.searchWithCache(term, callback, match)
    } else {
      this.props.search(term, callback, match)
    }
  }

  /**
   * @param {object} data - An element of array callbacked by search function.
   */
  replace(data: any) {
    return this.props.replace(data)
  }

  /** @private */
  searchWithCache(term: string, callback: Function, match: MatchData): void {
    if (this.cache && this.cache[term]) {
      callback(this.cache[term])
    } else {
      this.props.search(
        term,
        results => {
          if (this.cache) {
            this.cache[term] = results
          }
          callback(results)
        },
        match,
      )
    }
  }

  /** @private */
  matchText(text: string): MatchData | null {
    if (typeof this.match === "function") {
      return this.match(text)
    } else {
      return (text.match(this.match): any)
    }
  }

  /** @private */
  get match(): $PropertyType<StrategyProperties, "match"> {
    return this.props.match
  }

  /** @private */
  get index(): number {
    return typeof this.props.index === "number"
      ? this.props.index
      : DEFAULT_INDEX
  }

  get template(): (...any) => string {
    return this.props.template || DEFAULT_TEMPLATE
  }
}
