import chai from 'chai'
import { map } from 'ramda'
import { List } from 'immutable-ext'
import * as Coin from '../../src/coinSelection/coin.js'
const { expect } = chai

describe('Coin Selection', () => {
  describe('constants', () => {
    it('TX_EMPTY_SIZE', () => {
      expect(Coin.TX_EMPTY_SIZE).to.equal(10)
    })
    it('TX_INPUT_BASE', () => {
      expect(Coin.TX_INPUT_BASE).to.equal(41)
    })
    it('TX_EMPTY_SIZE', () => {
      expect(Coin.TX_INPUT_PUBKEYHASH).to.equal(106)
    })
    it('TX_EMPTY_SIZE', () => {
      expect(Coin.TX_OUTPUT_BASE).to.equal(9)
    })
    it('TX_EMPTY_SIZE', () => {
      expect(Coin.TX_OUTPUT_PUBKEYHASH).to.equal(25)
    })
  })

  describe('Coin Type', () => {
    it('coins monoid', () => {
      const A = Coin.fromJS({value: 100})
      const B = Coin.fromJS({value: 300})
      expect(A.concat(B).value).to.equal(400)
    })
    it('coins monoid', () => {
      const coins = map(Coin.fromJS, [{value: 1}, {value: 2}, {value: 3}, {value: 4}, {value: 5}, {value: 6}, {value: 7}, {value: 8}, {value: 9}, {value: 10}])
      const sum = List(coins).fold(Coin.empty).value
      expect(sum).to.equal(55)
    })
    it('coins setoid', () => {
      const A = Coin.fromJS({value: 100})
      const B = Coin.fromJS({value: 100})
      expect(A.equals(B)).to.equal(true)
    })
    it('coins setoid', () => {
      const A = Coin.fromJS({value: 100})
      const B = Coin.fromJS({value: 0})
      expect(A.equals(B)).to.equal(false)
    })
    it('coins setoid', () => {
      const A = Coin.fromJS({value: 100})
      const B = Coin.fromJS({value: 0})
      expect(A.lte(B)).to.equal(false)
    })
    it('coins setoid', () => {
      const A = Coin.fromJS({value: 0})
      const B = Coin.fromJS({value: 100})
      expect(A.lte(B)).to.equal(true)
    })
    it('coins map', () => {
      const A = Coin.fromJS({value: 100})
      const square = x => x * x
      expect(A.overValue(square).value).to.equal(square(A.value))
    })
    it('coin empty', () => {
      const A = Coin.empty
      expect(A.value).to.equal(0)
    })
  })
  describe('coin byte sizes', () => {
    it('should return the right input size', () => {
      expect(Coin.inputBytes({})).to.equal(147)
    })
    it('should return the right output size', () => {
      expect(Coin.outputBytes({})).to.equal(34)
    })
  })
  describe('effective values', () => {
    it('should return the right coin value', () => {
      expect(Coin.effectiveValue(55, Coin.fromJS({value: 15000}))).to.equal(6915)
    })
    it('should return zero coin value', () => {
      expect(Coin.effectiveValue(55000, Coin.fromJS({value: 15000}))).to.equal(0)
    })
    it('should return max coin value', () => {
      expect(Coin.effectiveValue(0, Coin.fromJS({value: 15000}))).to.equal(15000)
    })
  })
})
