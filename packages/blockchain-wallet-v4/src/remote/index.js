// import { map, sequence, add, multiply, reverse, lensProp, compose, reduce, identity, pick, prop } from 'ramda'
// import { List, Map } from 'immutable-ext'
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

// Remote.prototype.chain = function (f) {
//   return this.cata({
//     Success: (x) => f(x),
//     Failure: () => this,
//     Loading: () => this,
//     NotAsked: () => this
//   })
// }

// Remote.prototype.inspect = function () {
//   return this.toString()
// }

export default Remote

// see this to appreciate that: https://egghead.io/lessons/angular-1-x-applicative-functors-for-multiple-arguments
// export const liftA2 = (f, fx, fy) => fx.map(f).ap(fy)
// export const liftA3 = (f, fx, fy, fz) => fx.map(f).ap(fy).ap(fz)

// ////////////////////////////////////////////////////////////////////////////////
// // state example

// const wallet = {
//   balance: RemoteData.Loading,
//   // balance: RemoteData.Success(1000),
//   address: '1addressbtcdsadsdsadsa',
//   rate: RemoteData.NotAsked,
//   // rate: RemoteData.Success(1.345),
//   metadata: RemoteData.Success('This is a terrific wallet'),
//   extra: 'not interested in that',
//   // rates: [RemoteData.Success(10), RemoteData.Success(11), RemoteData.Success(12), RemoteData.Success(13)]
//   rates: [RemoteData.Loading, RemoteData.Failure('error mio'), RemoteData.Loading, RemoteData.Success(13)]
// }

// // selectors examples
// // state => RD(mydata)
// const selectAddressBalance = state => {
//   const finalShape = address => balance => ({address, balance})
//   return liftA2(finalShape, RemoteData.of(state.address), state.balance)
// }

// // select an array and flatten it
// const selectRates = compose(sequence(RemoteData.of), prop('rates'))

// // return balance converted by rate. Given a wallet, returns RemoteData.of(balance * rate)
// const convertedBalance = compose(
//                            map(reduce(multiply, 1)),
//                            sequence(RemoteData.of),
//                            Map,
//                            pick(['balance', 'rate'])
//                           )


// console.log(selectAddressBalance(wallet))
// console.log(selectRates(wallet))
// console.log(convertedBalance(wallet))

// ////////////////////////////////////////////////////////////////////////////////Applications
// // applicative and lists is super useful (list comprehensions)

// Number.prototype.concat = function(y) {
//   return this.valueOf() + y;
// }

// const square = x => x*x
// const cube = x => x*x*x
// const x = List([square, cube]).ap(List([1,2,3])).fold(0) // === 1^2 + 2^2 + 3^2 + 1^3 + 2^3 + 3^3 
// console.log(x)

// const combine = a => b =>`${a}-${b}`
// const y = List([combine]).ap(List(['even', 'odd'])).ap(List(['red', 'blue', 'green', 'yellow']))
// console.log(y)


// ////////////////////////////////////////////////////////////////////////////////
// // chain test
// console.log('----> Chain test')
// const chainer1 = str => str === 'fail' ? RemoteData.Failure('error nen') : RemoteData.Success(reverse(str))
// const chainer2 = str => str === 'fail' ? RemoteData.Loading : RemoteData.Success(reverse(str))

// console.log(RemoteData.Success('fail').chain(chainer2).chain(chainer1))
// console.log(RemoteData.Success('fail').chain(chainer1).chain(chainer2))

// // console.log(RemoteData.Success(square).ap(RemoteData.Success(3)))
