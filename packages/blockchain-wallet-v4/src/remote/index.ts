import { taggedSum } from 'daggy'

const Remote = taggedSum('Remote', {
  Failure: ['error'],
  Loading: [],
  NotAsked: [],
  Success: ['data']
})

Remote.prototype.map = function (f) {
  return this.cata({
    Failure: () => this,
    Loading: () => this,
    NotAsked: () => this,
    Success: (x) => Remote.Success(f(x))
  })
}

Remote.of = Remote.Success

Remote.prototype.ap = function (that) {
  return this.cata({
    Failure: () =>
      that.cata({
        Failure: () => this,
        Loading: () => this,
        NotAsked: () => that,
        Success: () => this
      }),
    Loading: () =>
      that.cata({
        Failure: () => that,
        Loading: () => that,
        NotAsked: () => that,
        Success: () => this
      }),
    NotAsked: () => this,
    Success: (f) => that.map(f)
  })
}

Remote.prototype.toJSON = function () {
  return {
    __serializedType__: this['@@tag'],
    data: { __remote: this['@@values'][0] || [] }
  }
}

Remote.prototype.chain = function (f) {
  return this.cata({
    Failure: () => this,
    Loading: () => this,
    NotAsked: () => this,
    Success: (x) => f(x)
  })
}

Remote.prototype.getOrElse = function (defaultValue) {
  return this.cata({
    Failure: () => defaultValue,
    Loading: () => defaultValue,
    NotAsked: () => defaultValue,
    Success: (value) => value
  })
}

Remote.prototype.getOrFail = function (errorValue) {
  return this.cata({
    Failure: () => {
      throw errorValue
    },
    Loading: () => {
      throw errorValue
    },
    NotAsked: () => {
      throw errorValue
    },
    Success: (value) => value
  })
}

export default Remote
