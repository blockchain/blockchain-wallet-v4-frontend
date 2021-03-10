import { add, compose, identity, lift, map, multiply, toUpper } from 'ramda'

import Remote from './index'

describe('Remote', () => {
  describe('Constructors', () => {
    it('should construct a Remote.Success', () => {
      let r = Remote.Success('value')
      expect(Remote.Success.is(r)).toEqual(true)
      expect(r.data).toEqual('value')
    })
    it('should construct a Remote.Failure', () => {
      let r = Remote.Failure('error')
      expect(r.error).toEqual('error')
      expect(Remote.Failure.is(r)).toEqual(true)
    })
    it('should construct a Remote.Loading', () => {
      let r = Remote.Loading
      expect(Remote.Loading.is(r)).toEqual(true)
    })
    it('should construct a Remote.NotAsked', () => {
      let r = Remote.NotAsked
      expect(Remote.NotAsked.is(r)).toEqual(true)
    })
  })

  describe('Functor laws', () => {
    let options = [
      Remote.Success(2),
      Remote.Failure('OMG'),
      Remote.Loading,
      Remote.NotAsked
    ]

    it('i) identity: map(id) == id', () => {
      let left = map(identity)
      let right = identity
      expect(map(left, options)).toEqual(map(right, options))
    })

    it('ii) composition: map(g . f) == map(g) . map(f)', () => {
      let f = add(3)
      let g = multiply(5)
      let left = compose(map(f), map(g))
      let right = map(compose(f, g))
      expect(map(left, options)).toEqual(map(right, options))
    })
  })

  describe('Applicative Functor laws', () => {
    it('i) identity: A.of(id).ap(r) == id(r)', () => {
      let opt = [
        Remote.Success(2),
        Remote.Failure('OMG'),
        Remote.Loading,
        Remote.NotAsked
      ]
      let left = r => Remote.of(identity).ap(r)
      let right = identity
      expect(map(left, opt)).toEqual(map(right, opt))
    })

    it('ii) homomorphism: A.of(f).ap(A.of(x)) = A.of(f(x))', () => {
      let f = toUpper
      let left = x => Remote.of(f).ap(Remote.of(x))
      let right = x => Remote.of(f(x))
      expect(left('hello')).toEqual(right('hello'))
    })

    it('iii) interchange: r.ap(A.of(x)) = A.of(f => f(x)).ap(r)', () => {
      let opt = [
        Remote.Success(x => x * x),
        Remote.Failure('OMG'),
        Remote.Loading,
        Remote.NotAsked
      ]
      let x = 3
      let left = r => r.ap(Remote.of(x))
      let right = r => Remote.of(f => f(x)).ap(r)
      expect(map(left, opt)).toEqual(map(right, opt))
    })

    it('iv) composotion: A.of(compose).ap(r).ap(s).ap(t) = r.ap(s.ap(t))', () => {
      let opt1 = [
        Remote.Success(x => x + 5),
        Remote.Failure('OMG'),
        Remote.Loading,
        Remote.NotAsked
      ]
      let opt2 = [
        Remote.Success(x => x * 5),
        Remote.Failure('OMG'),
        Remote.Loading,
        Remote.NotAsked
      ]
      let opt3 = [
        Remote.Success(3),
        Remote.Failure('OMG'),
        Remote.Loading,
        Remote.NotAsked
      ]
      let composition = f => g => x => f(g(x))
      let checkComposition = r => s => t =>
        expect(
          Remote.of(composition)
            .ap(r)
            .ap(s)
            .ap(t)
        ).toEqual(r.ap(s.ap(t)))
      lift(checkComposition)(opt1, opt2, opt3)
    })
  })

  describe('Monoid', () => {
    it('combination table', () => {
      let addR = Remote.of(x => y => x + y)
      expect(
        Remote.Success.is(addR.ap(Remote.Success(1)).ap(Remote.Success(2)))
      ).toEqual(true)

      expect(
        Remote.Failure.is(addR.ap(Remote.Success(1)).ap(Remote.Failure(2)))
      ).toEqual(true)
      expect(
        Remote.Failure.is(addR.ap(Remote.Failure(1)).ap(Remote.Failure(2)))
      ).toEqual(true)

      expect(
        Remote.Loading.is(addR.ap(Remote.Loading).ap(Remote.Success(2)))
      ).toEqual(true)
      expect(
        Remote.Failure.is(addR.ap(Remote.Loading).ap(Remote.Failure(2)))
      ).toEqual(true)
      expect(
        Remote.Loading.is(addR.ap(Remote.Loading).ap(Remote.Loading))
      ).toEqual(true)

      expect(
        Remote.NotAsked.is(addR.ap(Remote.NotAsked).ap(Remote.Success(2)))
      ).toEqual(true)
      expect(
        Remote.NotAsked.is(addR.ap(Remote.NotAsked).ap(Remote.Failure(2)))
      ).toEqual(true)
      expect(
        Remote.NotAsked.is(addR.ap(Remote.NotAsked).ap(Remote.Loading))
      ).toEqual(true)
      expect(
        Remote.NotAsked.is(addR.ap(Remote.NotAsked).ap(Remote.NotAsked))
      ).toEqual(true)
    })
  })
})
