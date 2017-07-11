import chai from 'chai'
import { map } from 'ramda'
import { List } from 'immutable-ext'
import * as cs from '../../src/coinSelection'
const { expect } = chai

describe('Coin Selection', () => {
  describe('constants', () => {
    it('TX_EMPTY_SIZE', () => {
      expect(cs.TX_EMPTY_SIZE).to.equal(10)
    })
    it('TX_INPUT_BASE', () => {
      expect(cs.TX_INPUT_BASE).to.equal(41)
    })
    it('TX_EMPTY_SIZE', () => {
      expect(cs.TX_INPUT_PUBKEYHASH).to.equal(106)
    })
    it('TX_EMPTY_SIZE', () => {
      expect(cs.TX_OUTPUT_BASE).to.equal(9)
    })
    it('TX_EMPTY_SIZE', () => {
      expect(cs.TX_OUTPUT_PUBKEYHASH).to.equal(25)
    })
  })

  describe('Coin Type', () => {
    it('coins monoid', () => {
      const A = cs.Coin(100)
      const B = cs.Coin(300)
      expect(A.concat(B).value).to.equal(400)
    })
    it('coins monoid', () => {
      const coins = map(cs.Coin, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      const sum = List(coins).fold(cs.Coin.empty()).value
      expect(sum).to.equal(55)
    })
    it('coins setoid', () => {
      const A = cs.Coin(100)
      const B = cs.Coin(100)
      expect(A.equals(B)).to.equal(true)
    })
    it('coins setoid', () => {
      const A = cs.Coin(100)
      const B = cs.Coin(0)
      expect(A.equals(B)).to.equal(false)
    })
    it('coins setoid', () => {
      const A = cs.Coin(100)
      const B = cs.Coin(0)
      expect(A.lte(B)).to.equal(false)
    })
    it('coins setoid', () => {
      const A = cs.Coin(0)
      const B = cs.Coin(100)
      expect(A.lte(B)).to.equal(true)
    })
    it('coins map', () => {
      const A = cs.Coin(100)
      const square = x => x * x
      expect(A.map(square).value).to.equal(square(A.value))
    })
    it('coin empty', () => {
      const A = cs.Coin.empty()
      expect(A.value).to.equal(0)
    })
  })

  describe('byte sizes', () => {
    it('should return the right input size', () => {
      expect(cs.inputBytes({})).to.equal(147)
    })
    it('should return the right output size', () => {
      expect(cs.outputBytes({})).to.equal(34)
    })
    it('should return the right transaction size (empty tx)', () => {
      expect(cs.transactionBytes([], [])).to.equal(10)
    })
    it('should return the right transaction size (1 in 2 out tx)', () => {
      expect(cs.transactionBytes([{}], [{}, {}])).to.equal(225)
    })
  })

  describe('effective values', () => {
    it('should return the right coin value', () => {
      expect(cs.effectiveValue(55, cs.Coin(15000))).to.equal(6915)
    })
    it('should return zero coin value', () => {
      expect(cs.effectiveValue(55000, cs.Coin(15000))).to.equal(0)
    })
    it('should return max coin value', () => {
      expect(cs.effectiveValue(0, cs.Coin(15000))).to.equal(15000)
    })
    it('should return the right effective max Balance', () => {
      const inputs = map(cs.Coin, [15000, 10000, 20000])
      const outputs = map(cs.Coin, [0, 0])
      expect(cs.effectiveBalance(0, inputs, outputs).value).to.equal(45000)
    })
    it('should return the right effective max Balance', () => {
      const inputs = map(cs.Coin, [15000, 10000, 20000])
      const outputs = map(cs.Coin, [0, 0])
      expect(cs.effectiveBalance(55, inputs, outputs).value).to.equal(16455)
    })
    it('should return the right effective max Balance', () => {
      expect(cs.effectiveBalance(55, [], []).value).to.equal(0)
    })
    it('should return the right effective max Balance', () => {
      expect(cs.effectiveBalance(0, [], []).value).to.equal(0)
    })
  })

  describe('findTarget', () => {
    it('should return the right selection', () => {
      const selection = cs.findTarget([], 0, [])
      expect(selection.fee).to.equal(0)
      expect(selection.inputs).to.deep.equal([])
      expect(selection.outputs).to.deep.equal([])
    })
    it('should return the right selection', () => {
      const inputs = map(cs.Coin, [1, 2, 3])
      const targets = map(cs.Coin, [10000])
      const selection = cs.findTarget(targets, 0, inputs)
      expect(selection.fee).to.equal(0)
      expect(selection.inputs).to.deep.equal([])
      expect(selection.outputs).to.deep.equal(targets)
    })
    it('should return the right selection', () => {
      const inputs = map(cs.Coin, [1, 20000, 300000])
      const targets = map(cs.Coin, [10000])
      const selection = cs.findTarget(targets, 55, inputs)
      expect(selection.fee).to.equal(18590)
      expect(selection.inputs.map(x => x.value)).to.deep.equal([20000, 300000])
      expect(selection.outputs.map(x => x.value)).to.deep.equal([10000, 291410])
    })
  })
  describe('selectAll', () => {
    it('should return the right selection', () => {
      const inputs = map(cs.Coin, [1, 20000, 0, 0, 300000])
      const selection = cs.selectAll(55, inputs)
      expect(selection.fee).to.equal(18590)
      expect(selection.inputs.map(x => x.value)).to.deep.equal([20000, 300000])
      expect(selection.outputs.map(x => x.value)).to.deep.equal([301410])
    })
    it('should return the right selection', () => {
      const inputs = map(cs.Coin, [])
      const selection = cs.selectAll(55, inputs)
      expect(selection.fee).to.equal(0)
      expect(selection.inputs.map(x => x.value)).to.deep.equal([])
      expect(selection.outputs.map(x => x.value)).to.deep.equal([0])
    })
  })
  describe('descentDraw', () => {
    it('should return the right selection', () => {
      const inputs = map(cs.Coin, [1, 20000, 0, 0, 300000, 50000, 30000])
      const targets = map(cs.Coin, [100000])
      const selection = cs.descentDraw(targets, 55, inputs)
      expect(selection.fee).to.equal(10505)
      expect(selection.inputs.map(x => x.value)).to.deep.equal([300000])
      expect(selection.outputs.map(x => x.value)).to.deep.equal([100000, 189495])
    })
  })
  describe('ascentDraw', () => {
    it('should return the right selection', () => {
      const inputs = map(cs.Coin, [1, 20000, 0, 0, 300000, 50000, 30000])
      const targets = map(cs.Coin, [100000])
      const selection = cs.ascentDraw(targets, 55, inputs)
      expect(selection.fee).to.equal(34760)
      expect(selection.inputs.map(x => x.value)).to.deep.equal([20000, 30000, 50000, 300000])
      expect(selection.outputs.map(x => x.value)).to.deep.equal([100000, 265240])
    })
  })
  describe('singleRandomDraw', () => {
    it('should return the right selection', () => {
      const seed = 'test-seed'
      const inputs = map(cs.Coin, [1, 20000, 0, 0, 300000, 50000, 30000])
      const targets = map(cs.Coin, [60000])
      const selection = cs.singleRandomDraw(targets, 55, inputs, seed)
      expect(selection.fee).to.equal(20000)
      expect(selection.inputs.map(x => x.value)).to.deep.equal([30000, 50000])
      expect(selection.outputs.map(x => x.value)).to.deep.equal([60000])
    })
  })
  describe('branchAndBound', () => {
    it('should return the right selection (exact match)', () => {
      const seed = 'test-seed'
      const inputs = map(cs.Coin, [1, 20000, 0, 0, 300000, 50000, 30000, 15000, 45000])
      const targets = map(cs.Coin, [60000, 20000])
      const selection = cs.branchAndBound(targets, 55, inputs, seed)
      expect(selection.fee).to.equal(35000)
      expect(selection.inputs.map(x => x.value)).to.deep.equal([50000, 45000, 20000])
      expect(selection.outputs.map(x => x.value)).to.deep.equal([60000, 20000])
    })
    it('should return the right selection (singleRandomDraw FallBack)', () => {
      const seed = 'test-seed'
      const inputs = map(cs.Coin, [1, 20000, 0, 0, 300000, 50000, 30000, 15000, 45000])
      const targets = map(cs.Coin, [150000])
      const selection = cs.branchAndBound(targets, 55, inputs, seed)
      expect(selection.fee).to.equal(10505)
      expect(selection.inputs.map(x => x.value)).to.deep.equal([300000])
      expect(selection.outputs.map(x => x.value)).to.deep.equal([150000, 139495])
    })
  })
})
