/* eslint-env node */

var sinon = require('sinon');

beforeEach(function () {
  this.sinon = sinon.sandbox.create();
});

afterEach(function () {
  this.sinon.restore();
});

var fs = require('fs');
var files = fs.readdirSync(__dirname);

for (var i = 0; i < files.length; i++) { 
  let file = files[i];
  if (file !== 'test-runner.js') {
    require(`./${file}`);
  }
}
