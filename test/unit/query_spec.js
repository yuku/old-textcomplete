require("../test_helper")

import Strategy from "../../src/strategy"
import SearchResult from "../../src/search_result"
import { createQuery } from "../test_utils"

const assert = require("power-assert")

describe("Query", function() {
  var query, term, match

  beforeEach(function() {
    term = "he"
    match = [term, "", term]
    query = createQuery(undefined, term, match)
  })

  describe("#strategy", function() {
    it("should be a Strategy", function() {
      assert(query.strategy instanceof Strategy)
    })
  })

  describe("#execute", function() {
    var callbackSpy

    function subject() {
      query.execute(callbackSpy)
    }

    beforeEach(function() {
      callbackSpy = this.sinon.spy()
    })

    it("should call Strategy#search", function() {
      var stub = this.sinon.stub(query.strategy, "search")
      subject()
      assert(stub.calledOnce)
      assert(stub.calledWith(term, this.sinon.match.func, match))
    })

    context("when Strategy#search callbacks with an array", function() {
      var callbackData

      beforeEach(function() {
        this.sinon
          .stub(query.strategy, "search")
          .callsFake(function(str, callback) {
            callbackData = str
            callback([callbackData])
          })
      })

      it("should callback with an array of SearchResults", function() {
        subject()
        assert(callbackSpy.calledOnce)
        assert(callbackSpy.calledWith(this.sinon.match.array))
        var result = callbackSpy.args[0][0][0]
        assert(result instanceof SearchResult)
        assert.strictEqual(result.data, callbackData)
        assert.strictEqual(result.term, term)
        assert.strictEqual(result.strategy, query.strategy)
      })
    })
  })
})
