(function () {
  var textarea = document.getElementById('textarea1');
  var textcomplete = new Textcomplete(textarea);
  textcomplete.register([
    {
      match: /(^|\s)(\w+)$/,
      search: function (term, callback) {
        callback([term.toUpperCase()]);
      },
      replace: function (value) {
        return '$1' + value;
      }
    }
  ]);
})();
