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

const CHAR_CODE_ZERO = '0'.charCodeAt(0);
const CHAR_CODE_NINE = '9'.charCodeAt(0);

function isDigit(charCode: number): boolean {
  return charCode >= CHAR_CODE_ZERO && charCode <= CHAR_CODE_NINE;
}

/**
 * Returns the line-height of the given node in pixels.
 */
export function getLineHeightPx(node: HTMLElement): number {
  const computedStyle = window.getComputedStyle(node);

  // If the char code starts with a digit, it is either a value in pixels,
  // or unitless, as per:
  // https://drafts.csswg.org/css2/visudet.html#propdef-line-height
  // https://drafts.csswg.org/css2/cascade.html#computed-value
  if (isDigit(computedStyle.lineHeight.charCodeAt(0))) {
    // In real browsers the value is *always* in pixels, even for unit-less
    // line-heights. However, we still check as per the spec.
    if (isDigit(computedStyle.lineHeight.charCodeAt(computedStyle.lineHeight.length - 1))) {
      return parseFloat(computedStyle.lineHeight, 10);
    } else {
      return parseFloat(computedStyle.lineHeight, 10) * parseFloat(computedStyle.fontSize, 10);
    }
  }

  // Otherwise, the value is "normal".
  // If the line-height is "normal", calculate by font-size
  const body = document.body;
  if (!body) {
    return 0;
  }
  const tempNode = document.createElement(node.nodeName);
  tempNode.innerHTML = '&nbsp;';
  tempNode.style.fontSize = computedStyle.fontSize;
  tempNode.style.fontFamily = computedStyle.fontFamily;
  body.appendChild(tempNode);
  // Assume the height of the element is the line-height
  const height = tempNode.offsetHeight;
  body.removeChild(tempNode);
  return height;
}
