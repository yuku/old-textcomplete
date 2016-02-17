(function () {
  var textarea = new Textcomplete.editors.Textarea(document.getElementById('textarea1'));
  window.textcomplete = new Textcomplete(textarea);
  textcomplete.register([
    {
      match: /(^|\s)(\w+)$/,
      search: function (term, callback) {
        callback([term.toUpperCase(), term.toLowerCase()]);
      },
      replace: function (value) {
        return '$1' + value;
      }
    }
  ]);
})();
