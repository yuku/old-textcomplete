/* eslint-env node */

const fs = require('fs');
const path = require('path');
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

['unit', 'integration'].forEach(name => {
  let files = fs.readdirSync(path.join(__dirname, name));

  for (let i = 0; i < files.length; i++) { 
    let file = files[i];
    if (/-spec.js$/.test(file)) {
      require(path.join(__dirname, name, file));
    }
  }
});
