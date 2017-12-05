// @flow

import Dropdown from "./dropdown"
import SearchResult from "./search_result"

export const CLASS_NAME = "textcomplete-item"
const ACTIVE_CLASS_NAME = `${CLASS_NAME} active`
const CALLBACK_METHODS = ["onClick", "onMouseover"]

/**
 * Encapsulate an item of dropdown.
 */
export default class DropdownItem {
  searchResult: SearchResult
  active: boolean
  siblings: DropdownItem[]
  dropdown: Dropdown
  index: number
  _el: ?HTMLLIElement

  constructor(searchResult: SearchResult) {
    this.searchResult = searchResult
    this.active = false

    CALLBACK_METHODS.forEach(method => {
      ;(this: any)[method] = (this: any)[method].bind(this)
    })
  }

  get el(): HTMLLIElement {
    if (this._el) {
      return this._el
    }
    const li = document.createElement("li")
    li.className = this.active ? ACTIVE_CLASS_NAME : CLASS_NAME
    const a = document.createElement("a")
    a.innerHTML = this.searchResult.render()
    li.appendChild(a)
    this._el = li
    li.addEventListener("mousedown", this.onClick)
    li.addEventListener("mouseover", this.onMouseover)
    li.addEventListener("touchstart", this.onClick)
    return li
  }

  /**
   * Try to free resources and perform other cleanup operations.
   */
  destroy() {
    this.el.removeEventListener("mousedown", this.onClick, false)
    this.el.removeEventListener("mouseover", this.onMouseover, false)
    this.el.removeEventListener("touchstart", this.onClick, false)
    if (this.active) {
      this.dropdown.activeItem = null
    }
    // This element has already been removed by {@link Dropdown#clear}.
    this._el = null
  }

  /**
   * Callbacked when it is appended to a dropdown.
   *
   * @see Dropdown#append
   */
  appended(dropdown: Dropdown) {
    this.dropdown = dropdown
    this.siblings = dropdown.items
    this.index = this.siblings.length - 1
  }

  /**
   * Deactivate active item then activate itself.
   *
   * @return {this}
   */
  activate() {
    if (!this.active) {
      const activeItem = this.dropdown.getActiveItem()
      if (activeItem) {
        activeItem.deactivate()
      }
      this.dropdown.activeItem = this
      this.active = true
      this.el.className = ACTIVE_CLASS_NAME
    }
    return this
  }

  /**
   * Get the next sibling.
   */
  get next(): ?DropdownItem {
    let nextIndex
    if (this.index === this.siblings.length - 1) {
      if (!this.dropdown.rotate) {
        return null
      }
      nextIndex = 0
    } else {
      nextIndex = this.index + 1
    }
    return this.siblings[nextIndex]
  }

  /**
   * Get the previous sibling.
   */
  get prev(): ?DropdownItem {
    let nextIndex
    if (this.index === 0) {
      if (!this.dropdown.rotate) {
        return null
      }
      nextIndex = this.siblings.length - 1
    } else {
      nextIndex = this.index - 1
    }
    return this.siblings[nextIndex]
  }

  /** @private */
  deactivate() {
    if (this.active) {
      this.active = false
      this.el.className = CLASS_NAME
      this.dropdown.activeItem = null
    }
    return this
  }

  /** @private */
  onClick(e: Event) {
    e.preventDefault() // Prevent blur event
    this.dropdown.select(this)
  }

  /** @private */
  onMouseover() {
    this.activate()
  }
}
