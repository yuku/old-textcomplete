require('../test_helper');

import {lock, createCustomEvent} from '../../src/utils';

const assert = require('power-assert');

describe('lock', function () {
  it('should ignore locked call and replay last call when free arg is called', function () {
    var free = null;
    var spy = this.sinon.spy();
    var lockedFunc = lock(function (freeFunc, arg) {
      spy(arg);
      free = freeFunc;
    });

    lockedFunc(0);
    assert(spy.calledOnce);
    assert(spy.calledWith(0));

    lockedFunc(1);
    assert(spy.calledOnce);

    lockedFunc(2);
    free();
    assert(spy.calledTwice);
    assert(spy.secondCall.calledWith(2));
  });

  it('should not replay if there is no extra call', function () {
    var free = null;
    var spy = this.sinon.spy();
    var lockedFunc = lock(function (freeFunc) {
      spy();
      free = freeFunc;
    });

    lockedFunc();
    assert(spy.calledOnce);

    free();
    assert(spy.calledOnce);
  });
});

describe('createCustomEvent', function () {
  it('should return a CustomEvent', function () {
    var event = createCustomEvent('hello');
    assert(event instanceof document.defaultView.CustomEvent);
    assert.equal(event.type, 'hello');
  });

  context('without options', function () {
    it('should not be able to prevent default', function () {
      var event = createCustomEvent('hello');
      event.preventDefault();
      assert(!event.defaultPrevented);
    });

    it('should not have detail', function () {
      var event = createCustomEvent('hello');
      assert.equal(event.detail, null);
    });
  });

  context('with truthy cancelable', function () {
    it('should be able to prevent default', function () {
      var event = createCustomEvent('hello', { cancelable: true });
      event.preventDefault();
      assert(event.defaultPrevented);
    });
  });

  context('with detail', function () {
    it('should be able to prevent default', function () {
      var detail = {};
      var event = createCustomEvent('hello', {detail});
      assert.strictEqual(event.detail, detail);
    });
  });
});
