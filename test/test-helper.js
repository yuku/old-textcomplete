const jsdom = require('jsdom');

/**
 * @returns {HTMLTextAreaElement}
 */
export function getTextarea() {
  var document = jsdom.jsdom('<textarea></textarea>');
  return document.body.firstChild;
}
