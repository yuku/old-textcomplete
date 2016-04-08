import extend from 'lodash.assignin';

/**
 * Exclusive execution control utility.
 *
 * @param {function} func - The function to be locked. It is executed with a
 *                          function named `free` as the first argument. Once
 *                          it is called, additional execution are ignored
 *                          until the free is invoked. Then the last ignored
 *                          execution will be replayed immediately.
 * @example
 * var lockedFunc = lock(function (free) {
 *   setTimeout(function { free(); }, 1000); // It will be free in 1 sec.
 *   console.log('Hello, world');
 * });
 * lockedFunc();  // => 'Hello, world'
 * lockedFunc();  // none
 * lockedFunc();  // none
 * // 1 sec past then
 * // => 'Hello, world'
 * lockedFunc();  // => 'Hello, world'
 * lockedFunc();  // none
 * @returns {function} A wrapped function.
 */
export function lock(func) {
  var locked, queuedArgsToReplay;

  return function () {
    // Convert arguments into a real array.
    const args = Array.prototype.slice.call(arguments);
    if (locked) {
      // Keep a copy of this argument list to replay later.
      // OK to overwrite a previous value because we only replay
      // the last one.
      queuedArgsToReplay = args;
      return;
    }
    locked = true;
    const self = this;
    function replayOrFree() {
      if (queuedArgsToReplay) {
        // Other request(s) arrived while we were locked.
        // Now that the lock is becoming available, replay
        // the latest such request, then call back here to
        // unlock (or replay another request that arrived
        // while this one was in flight).
        const replayArgs = queuedArgsToReplay;
        queuedArgsToReplay = undefined;
        replayArgs.unshift(replayOrFree);
        func.apply(self, replayArgs);
      } else {
        locked = false;
      }
    }
    args.unshift(replayOrFree);
    func.apply(this, args);
  };
}

/**
 * Create a document fragment by the given HTML string.
 *
 * @param {string} tagString
 * @returns {DocumentFragment}
 */
export function createFragment(tagString) {
  // TODO Imprement with Range#createContextualFragment when it drops IE9 support.
  const div = document.createElement('div');
  div.innerHTML = tagString;
  const childNodes = div.childNodes;
  const fragment = document.createDocumentFragment();
  for (let i = 0, l = childNodes.length; i < l; i++) {
    fragment.appendChild(childNodes[i]);
  }
  return fragment;
}

/**
 * @param {string} type
 * @param {Object} [options]
 * @param {Object} [options.detail=undefined]
 * @param {Boolean} [options.cancelable=false]
 * @returns {CustomEvent}
 */
export function createCustomEvent(type, options) {
  return new document.defaultView.CustomEvent(type, extend({
    cancelable: false,
    detail: undefined,
  }, options));
}

/**
 * Get the current coordinates of the `el` relative to the document.
 *
 * @param {HTMLElement} el
 * @returns {{top: number, left: number}}
 */
export function calculateElementOffset(el) {
  const rect = el.getBoundingClientRect();
  const {defaultView, documentElement} = el.ownerDocument;
  return {
    top: rect.top + defaultView.pageYOffset - documentElement.clientTop,
    left: rect.left + defaultView.pageXOffset - documentElement.clientLeft,
  };
}

/**
 * @returns {?number} Returns IE version or if not IE return null.
 */
export function getIEVersion() {
  const nav = navigator.userAgent.toLowerCase();
  return (nav.indexOf('msie') !== -1) ? parseInt(nav.split('msie')[1], 10) : null;
}
