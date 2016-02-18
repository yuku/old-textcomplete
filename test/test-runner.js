/* eslint-env node */

const sinon = require('sinon');
const jsdom = require('jsdom');

beforeEach(function () {
  this.sinon = sinon.sandbox.create();
  global.document = jsdom.jsdom();
});

afterEach(function () {
  this.sinon.restore();
  delete global.document;
});

var fs = require('fs');
var files = fs.readdirSync(__dirname);

for (var i = 0; i < files.length; i++) { 
  let file = files[i];
  if (/-spec.js$/.test(file)) {
    require(`./${file}`);
  }
}
