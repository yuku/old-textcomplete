import Textcomplete from '../textcomplete';

import Textarea from '../textarea';

var textarea = new Textarea(document.getElementById('textarea1'));
var textcomplete = new Textcomplete(textarea);
textcomplete.register([
  {
    match: /(^|\s)(\w+)$/,
    search: function (term, callback) {
      callback([term.toUpperCase(), term.toLowerCase()]);
    },
    replace: function (value) {
      return `$1${value} `;
    }
  }
]);
