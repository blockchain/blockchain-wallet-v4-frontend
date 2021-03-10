import { map } from 'ramda'

import * as Coin from './coin.js'
import * as cs from './index'

describe('Coin Selection', () => {
  describe('byte sizes', () => {
    it('should return the right transaction size (empty tx)', () => {
      expect(cs.transactionBytes([], [])).toEqual(10)
    })
    it('should return the right transaction size (1 in 2 out tx)', () => {
      expect(cs.transactionBytes([{}], [{}, {}])).toEqual(225)
    })
  })
  describe('effective Balances', () => {
    it('should return the right effective max balance with no value and empty valued outputs', () => {
      const inputs = map(Coin.fromJS, [
        { value: 15000 },
        { value: 10000 },
        { value: 20000 }
      ])
      const outputs = map(Coin.fromJS, [{ value: 0 }, { value: 0 }])
      expect(cs.effectiveBalance(0, inputs, outputs).value).toEqual(45000)
    })
    it('should return the right effective max balance with value and empty valued outputs', () => {
      const inputs = map(Coin.fromJS, [
        { value: 15000 },
        { value: 10000 },
        { value: 20000 }
      ])
      const outputs = map(Coin.fromJS, [{ value: 0 }, { value: 0 }])
      expect(cs.effectiveBalance(55, inputs, outputs).value).toEqual(16455)
    })
    it('should return the right effective max balance w/ no inputs or outputs', () => {
      expect(cs.effectiveBalance(55, [], []).value).toEqual(0)
    })
    it('should return the right effective max balance w/ no value, inputs or outputs', () => {
      expect(cs.effectiveBalance(0, [], []).value).toEqual(0)
    })
  })

  describe('findTarget', () => {
    it('should return the right selection with empty inputs and targets, ', () => {
      const selection = cs.findTarget([], 0, [])
      expect(selection.fee).toEqual(0)
      expect(selection.inputs).toEqual([])
      expect(selection.outputs).toEqual([])
    })
    it('should return the right selection without feePerByte set', () => {
      const inputs = map(Coin.fromJS, [
        { value: 1 },
        { value: 2 },
        { value: 3 }
      ])
      const targets = map(Coin.fromJS, [{ value: 10000 }])
      const selection = cs.findTarget(targets, 0, inputs)
      expect(selection.fee).toEqual(0)
      expect(selection.inputs).toEqual([])
      expect(selection.outputs).toEqual(targets)
    })
    it('should return the right selection with feePerByte set', () => {
      const inputs = map(Coin.fromJS, [
        { value: 1 },
        { value: 20000 },
        { value: 300000 }
      ])
      const targets = map(Coin.fromJS, [{ value: 10000 }])
      const feePerByte = 55
      const selection = cs.findTarget(targets, feePerByte, inputs)

      const estimatedSize = 10 + 2 * 147 + 2 * 34 // 372
      const estimatedFee = estimatedSize * feePerByte // 20460

      expect(selection.fee).toEqual(estimatedFee)
      expect(selection.inputs.map(x => x.value)).toEqual([20000, 300000])
      expect(selection.outputs.map(x => x.value)).toEqual([
        10000,
        300000 + 20000 - 10000 - estimatedFee
      ])
    })
  })
  describe('selectAll', () => {
    it('should return the right selection with inputs', () => {
      const inputs = map(Coin.fromJS, [
        { value: 1 },
        { value: 20000 },
        { value: 0 },
        { value: 0 },
        { value: 300000 }
      ])
      const selection = cs.selectAll(55, inputs)
      expect(selection.fee).toEqual(18590)
      expect(selection.inputs.map(x => x.value)).toEqual([20000, 300000])
      expect(selection.outputs.map(x => x.value)).toEqual([301410])
    })
    it('should return the right selection without inputs', () => {
      const inputs = map(Coin.fromJS, [])
      const selection = cs.selectAll(55, inputs)
      expect(selection.fee).toEqual(0)
      expect(selection.inputs.map(x => x.value)).toEqual([])
      expect(selection.outputs.map(x => x.value)).toEqual([0])
    })
  })
  describe('descentDraw', () => {
    it('should return the right selection', () => {
      const inputs = map(Coin.fromJS, [
        { value: 1 },
        { value: 20000 },
        { value: 0 },
        { value: 0 },
        { value: 300000 },
        { value: 50000 },
        { value: 30000 }
      ])
      const targets = map(Coin.fromJS, [{ value: 100000 }])
      const selection = cs.descentDraw(targets, 55, inputs, 'change-address')
      expect(selection.fee).toEqual(20460)
      expect(selection.inputs.map(x => x.value)).toEqual([20000, 300000])
      expect(selection.outputs.map(x => x.value)).toEqual([100000, 199540])
    })
  })
  describe('ascentDraw', () => {
    it('should return the right selection', () => {
      const inputs = map(Coin.fromJS, [
        { value: 1 },
        { value: 20000 },
        { value: 0 },
        { value: 0 },
        { value: 300000 },
        { value: 50000 },
        { value: 30000 }
      ])
      const targets = map(Coin.fromJS, [{ value: 100000 }])
      const selection = cs.ascentDraw(targets, 55, inputs, 'change-address')
      expect(selection.fee).toEqual(20460)
      expect(selection.inputs.map(x => x.value)).toEqual([20000, 300000])
      expect(selection.outputs.map(x => x.value)).toEqual([100000, 199540])
    })
  })
  describe('singleRandomDraw', () => {
    it('should return the right selection', () => {
      const seed = 'test-seed'
      const inputs = map(Coin.fromJS, [
        { value: 1 },
        { value: 20000 },
        { value: 0 },
        { value: 0 },
        { value: 300000 },
        { value: 50000 },
        { value: 30000 }
      ])
      const targets = map(Coin.fromJS, [{ value: 60000 }])
      const selection = cs.singleRandomDraw(
        targets,
        55,
        inputs,
        'change-address',
        seed
      )
      expect(selection.fee).toEqual(20000)
      expect(selection.inputs.map(x => x.value)).toEqual([30000, 50000])
      expect(selection.outputs.map(x => x.value)).toEqual([60000])
    })
  })
  describe('branchAndBound', () => {
    it('should return the right selection (exact match)', () => {
      const seed = 'test-seed'
      const inputs = map(Coin.fromJS, [
        { value: 1 },
        { value: 20000 },
        { value: 0 },
        { value: 0 },
        { value: 300000 },
        { value: 50000 },
        { value: 30000 },
        { value: 15000 },
        { value: 45000 }
      ])
      const targets = map(Coin.fromJS, [{ value: 60000 }, { value: 20000 }])
      const selection = cs.branchAndBound(
        targets,
        55,
        inputs,
        'change-address',
        seed
      )
      expect(selection.fee).toEqual(35000)
      expect(selection.inputs.map(x => x.value)).toEqual([20000, 50000, 45000])
      expect(selection.outputs.map(x => x.value)).toEqual([60000, 20000])
    })
    it('should return the right selection (singleRandomDraw FallBack)', () => {
      const seed = 'test-seed'
      const inputs = map(Coin.fromJS, [
        { value: 1 },
        { value: 20000 },
        { value: 0 },
        { value: 0 },
        { value: 300000 },
        { value: 50000 },
        { value: 30000 },
        { value: 15000 },
        { value: 45000 }
      ])
      const targets = map(Coin.fromJS, [{ value: 150000 }])
      const selection = cs.branchAndBound(
        targets,
        55,
        inputs,
        'change-address',
        seed
      )
      expect(selection.fee).toEqual(52800)
      expect(selection.inputs.map(x => x.value)).toEqual([
        20000,
        15000,
        45000,
        50000,
        30000,
        300000
      ])
      expect(selection.outputs.map(x => x.value)).toEqual([150000, 257200])
    })
  })
})
