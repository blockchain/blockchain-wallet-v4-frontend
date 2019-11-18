// https://medium.com/@jaumepernas/your-data-is-loading-1425c6b76bf0

import { taggedSum } from 'daggy'

const Remote = taggedSum('Remote', {
  NotAsked: [],
  Loading: [],
  Failure: ['error'],
  Success: ['data']
})
Remote.of = Remote.Success

Remote.prototype.map = function (f) {
  return this.cata({
    Success: x => Remote.Success(f(x)),
    Failure: () => this,
    Loading: () => this,
    NotAsked: () => this
  })
}

Remote.prototype.ap = function (that) {
  return this.cata({
    Success: f => that.map(f),
    Failure: () =>
      that.cata({
        Success: f => this,
        Failure: () => this,
        Loading: () => this,
        NotAsked: () => that
      }),
    Loading: () =>
      that.cata({
        Success: f => this,
        Failure: () => that,
        Loading: () => that,
        NotAsked: () => that
      }),
    NotAsked: () => this
  })
}

Remote.prototype.toJSON = function () {
  return {
    data: { __remote: this['@@values'][0] || [] },
    __serializedType__: this['@@tag']
  }
}

Remote.prototype.chain = function (f) {
  return this.cata({
    Success: x => f(x),
    Failure: () => this,
    Loading: () => this,
    NotAsked: () => this
  })
}

Remote.prototype.getOrElse = function (defaultValue) {
  return this.cata({
    Success: value => value,
    Failure: () => defaultValue,
    Loading: () => defaultValue,
    NotAsked: () => defaultValue
  })
}

Remote.prototype.getOrFail = function (errorValue) {
  return this.cata({
    Success: value => value,
    Failure: () => {
      throw errorValue
    },
    Loading: () => {
      throw errorValue
    },
    NotAsked: () => {
      throw errorValue
    }
  })
}

export default Remote
