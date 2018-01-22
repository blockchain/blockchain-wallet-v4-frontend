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
    Success: (x) => Remote.Success(f(x)),
    Failure: () => this,
    Loading: () => this,
    NotAsked: () => this
  })
}

Remote.prototype.ap = function (that) {
  return this.cata({
    Success: (f) => that.map(f),
    Failure: () => that.cata({
      Success: (f) => this,
      Failure: () => this,
      Loading: () => this,
      NotAsked: () => that
    }),
    Loading: () => that.cata({
      Success: (f) => this,
      Failure: () => that,
      Loading: () => that,
      NotAsked: () => that
    }),
    NotAsked: () => this
  })
}

Remote.prototype.toJSON = function () {
  return { data: this['@@values'][0] || [], __serializedType__: this['@@tag'] }
}

Remote.prototype.chain = function (f) {
  return this.cata({
    Success: (x) => f(x),
    Failure: () => this,
    Loading: () => this,
    NotAsked: () => this
  })
}

export default Remote
