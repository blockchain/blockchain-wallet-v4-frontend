'use strict'
exports.__esModule = true
var daggy_1 = require('daggy')
var Remote = daggy_1.taggedSum('Remote', {
  NotAsked: [],
  Loading: [],
  Failure: ['error'],
  Success: ['data']
})
Remote.of = Remote.Success
Remote.prototype.map = function (f) {
  var _this = this
  return this.cata({
    Success: function (x) {
      return Remote.Success(f(x))
    },
    Failure: function () {
      return _this
    },
    Loading: function () {
      return _this
    },
    NotAsked: function () {
      return _this
    }
  })
}
Remote.prototype.toJSON = function () {
  return {
    data: { __remote: this['@@values'][0] || [] },
    __serializedType__: this['@@tag']
  }
}
Remote.prototype.chain = function (f) {
  var _this = this
  return this.cata({
    Success: function (x) {
      return f(x)
    },
    Failure: function () {
      return _this
    },
    Loading: function () {
      return _this
    },
    NotAsked: function () {
      return _this
    }
  })
}
Remote.prototype.getOrElse = function (defaultValue) {
  return this.cata({
    Success: function (value) {
      return value
    },
    Failure: function () {
      return defaultValue
    },
    Loading: function () {
      return defaultValue
    },
    NotAsked: function () {
      return defaultValue
    }
  })
}
Remote.prototype.getOrFail = function (errorValue) {
  return this.cata({
    Success: function (value) {
      return value
    },
    Failure: function () {
      throw errorValue
    },
    Loading: function () {
      throw errorValue
    },
    NotAsked: function () {
      throw errorValue
    }
  })
}
exports['default'] = Remote
