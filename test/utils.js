import {lock} from '../src/utils';

const assert = require('power-assert');
const sinon = require('sinon');

describe('lock', function () {
  it('should ignore locked call and replay last call when free arg is called', function () {
    var free = null;
    var spy = sinon.spy();
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
    var spy = sinon.spy();
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
