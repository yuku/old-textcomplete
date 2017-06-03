// @flow

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
 */
export function lock(func: (Function, any) => any): Function {
  let locked: boolean, queuedArgsToReplay: any;

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
 */
export function createFragment(tagString: string): DocumentFragment {
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
 * Create a custom event
 */
export const createCustomEvent = (() => {
  if (typeof window.CustomEvent === 'function') {
    return function (type: string, options: ?{ detail?: Object; cancelable?: boolean; }): CustomEvent {
      return new document.defaultView.CustomEvent(type, {
        cancelable: options && options.cancelable || false,
        detail: options && options.detail || undefined,
      });
    };
  } else {
    // Custom event polyfill from
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#polyfill
    return function (type: string, options: ?{ detail?: Object; cancelable?: boolean; }): CustomEvent {
      const event = document.createEvent('CustomEvent');
      event.initCustomEvent(type,
        /* bubbles */ false,
        options && options.cancelable || false,
        options && options.detail || undefined);
      return event;
    };
  }
})();

/**
 * Get the current coordinates of the `el` relative to the document.
 */
export function calculateElementOffset(el: HTMLElement): { top: number; left: number; } {
  const rect = el.getBoundingClientRect();
  const {defaultView, documentElement} = el.ownerDocument;
  const offset = { top: rect.top + defaultView.pageYOffset, left: rect.left + defaultView.pageXOffset };
  if (documentElement) {
    offset.top -= documentElement.clientTop;
    offset.left -= documentElement.clientLeft;
  }
  return offset;
}

/**
 * Returns IE version if it is IE; otherwise null.
 */
export function getIEVersion(): ?number {
  const nav = navigator.userAgent.toLowerCase();
  return (nav.indexOf('msie') !== -1) ? parseInt(nav.split('msie')[1], 10) : null;
}
