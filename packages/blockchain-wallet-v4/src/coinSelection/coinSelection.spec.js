import { map } from 'ramda'

import * as Coin from './coin.js'
import * as cs from './index'

describe('Coin Selection', () => {
  describe('byte sizes', () => {
    const legacyInput = { type: () => 'P2PKH' }
    const legacyOutput = { type: () => 'P2PKH' }
    const segwitInput = { type: () => 'P2WPKH' }
    const segwitOutput = { type: () => 'P2WPKH' }

    describe('0x0 transactions', () => {
      it('should return the right transaction size (empty tx)', () => {
        // No witness => 10 vbytes
        expect(cs.transactionBytes([], [])).toEqual(10)
      })
    })

    describe('1x1 transactions', () => {
      it('should return the right transaction size (1 P2PKH, 1 P2PKH)', () => {
        // 10 + 148 + 34 = 192
        expect(cs.transactionBytes([legacyInput], [legacyOutput])).toEqual(192)
      })
      it('should return the right transaction size (1 P2PKH, 1 P2WPKH)', () => {
        // 10 + 148 + 31 = 189
        expect(cs.transactionBytes([legacyInput], [segwitOutput])).toEqual(189)
      })
      it('should return the right transaction size (1 P2WPKH, 1 P2PKH)', () => {
        // 10.75 + 67.75 + 34 = 112.5
        expect(cs.transactionBytes([segwitInput], [legacyOutput])).toEqual(112.5)
      })
      it('should return the right transaction size (1 P2WPKH, 1 P2WPKH)', () => {
        // 10.75 + 67.75 + 31 = 109.5
        expect(cs.transactionBytes([segwitInput], [segwitOutput])).toEqual(109.5)
      })
    })

    describe('1x2 transactions', () => {
      it('should return the right transaction size (1 P2PKH, 2 P2PKH)', () => {
        // 10 + 148 + 34*2 = 226
        expect(cs.transactionBytes([legacyInput], [legacyOutput, legacyOutput])).toEqual(226)
      })
      it('should return the right transaction size (1 P2PKH, 2 P2WPKH)', () => {
        // 10 + 148 + 31*2 = 220
        expect(cs.transactionBytes([legacyInput], [segwitOutput, segwitOutput])).toEqual(220)
      })
      it('should return the right transaction size (1 P2PKH, 1 P2PKH + 1 P2WPKH)', () => {
        // 10 + 148 + 31 + 34 = 223
        expect(cs.transactionBytes([legacyInput], [legacyOutput, segwitOutput])).toEqual(223)
      })
      it('should return the right transaction size (1 P2WPKH, 2 P2PKH)', () => {
        // 10.75 + 67.75 + 34*2 = 146.5
        expect(cs.transactionBytes([segwitInput], [legacyOutput, legacyOutput])).toEqual(146.5)
      })
      it('should return the right transaction size (1 P2WPKH, 2 P2WPKH)', () => {
        // 10.75 + 67.75 + 31*2 = 140.5
        expect(cs.transactionBytes([segwitInput], [segwitOutput, segwitOutput])).toEqual(140.5)
      })
      it('should return the right transaction size (1 P2WPKH, 1 P2PKH + 1 P2WPKH)', () => {
        // 10.75 + 67.75 + 31 + 34 = 143.5
        expect(cs.transactionBytes([segwitInput], [legacyOutput, segwitOutput])).toEqual(143.5)
      })
    })

    describe('2x1 transactions', () => {
      it('should return the right transaction size (2 P2PKH, 1 P2PKH)', () => {
        // 10 + 148*2 + 34 = 340
        expect(cs.transactionBytes([legacyInput, legacyInput], [legacyOutput])).toEqual(340)
      })
      it('should return the right transaction size (2 P2PKH, 1 P2WPKH)', () => {
        // 10 + 148*2 + 31 = 337
        expect(cs.transactionBytes([legacyInput, legacyInput], [segwitOutput])).toEqual(337)
      })
      it('should return the right transaction size (1 P2PKH + P2WPKH, 1 P2PKH)', () => {
        // 10.75 + 67.75 + 148 + 34 = 260.5
        expect(cs.transactionBytes([legacyInput, segwitInput], [legacyOutput])).toEqual(260.5)
      })
      it('should return the right transaction size (2 P2WPKH, 1 P2PKH)', () => {
        // 10.75 + 67.75*2 + 34 = 180.25
        expect(cs.transactionBytes([segwitInput, segwitInput], [legacyOutput])).toEqual(180.25)
      })
      it('should return the right transaction size (2 P2WPKH, 1 P2WPKH)', () => {
        // 10.75 + 67.75*2 + 31 = 177.25
        expect(cs.transactionBytes([segwitInput, segwitInput], [segwitOutput])).toEqual(177.25)
      })
      it('should return the right transaction size (1 P2PKH + 1 P2WPKH, 1 P2WPKH)', () => {
        // 10.75 + 67.75 + 148 + 31 = 257.5
        expect(cs.transactionBytes([legacyInput, segwitInput], [segwitOutput])).toEqual(257.5)
      })
    })

    describe('2x2 transactions', () => {
      it('should return the right transaction size (2 P2PKH, 2 P2PKH)', () => {
        // 10 + 148*2 + 34*2 = 374
        expect(
          cs.transactionBytes([legacyInput, legacyInput], [legacyOutput, legacyOutput])
        ).toEqual(374)
      })
      it('should return the right transaction size (2 P2PKH, 2 P2WPKH)', () => {
        // 10 + 148*2 + 31*2 = 368
        expect(
          cs.transactionBytes([legacyInput, legacyInput], [segwitOutput, segwitOutput])
        ).toEqual(368)
      })
      it('should return the right transaction size (1 P2PKH + 1 P2WPKH, 2 P2PKH)', () => {
        // 10.75 + 148 + 67.75 + 34*2 = 294.5
        expect(
          cs.transactionBytes([legacyInput, segwitInput], [legacyOutput, legacyOutput])
        ).toEqual(294.5)
      })
      it('should return the right transaction size (2 P2PKH, 1 P2PKH + 1 P2WPKH)', () => {
        // 10 + 148*2 + 31 + 34 = 371
        expect(
          cs.transactionBytes([legacyInput, legacyInput], [legacyOutput, segwitOutput])
        ).toEqual(371)
      })
      it('should return the right transaction size (1 P2PKH + 1 P2PWKH, 1 P2PKH + 1 P2WPKH)', () => {
        // 10.75 + 67.75 + 148 + 31 + 34 = 291.5
        expect(
          cs.transactionBytes([legacyInput, segwitInput], [legacyOutput, segwitOutput])
        ).toEqual(291.5)
      })
      it('should return the right transaction size (2 P2WPKH, 2 P2PKH)', () => {
        // 10.75 + 67.75*2 + 34*2 = 214.25
        expect(
          cs.transactionBytes([segwitInput, segwitInput], [legacyOutput, legacyOutput])
        ).toEqual(214.25)
      })
      it('should return the right transaction size (2 P2WPKH, 2 P2WPKH)', () => {
        // 10.75 + 67.75*2 + 31*2 = 208.25
        expect(
          cs.transactionBytes([segwitInput, segwitInput], [segwitOutput, segwitOutput])
        ).toEqual(208.25)
      })
      it('should return the right transaction size (2 P2WPKH, 1 P2PKH + 1 P2WPKH)', () => {
        // 10.75 + 67.75*2 + 31 + 34 = 211.25
        expect(
          cs.transactionBytes([segwitInput, segwitInput], [legacyOutput, segwitOutput])
        ).toEqual(211.25)
      })
      it('should return the right transaction size (1 P2PKH + 1 P2WPKH, 2 P2WPKH)', () => {
        // 10.75 + 67.75 + 148 + 31*2 = 288.5
        expect(
          cs.transactionBytes([legacyInput, segwitInput], [segwitOutput, segwitOutput])
        ).toEqual(288.5)
      })
    })
  })

  describe('effective Balances', () => {
    it('should return the right effective max balance with no value and empty valued outputs', () => {
      const inputs = map(Coin.fromJS, [{ value: 15000 }, { value: 10000 }, { value: 20000 }])
      const outputs = map(Coin.fromJS, [{ value: 0 }, { value: 0 }])

      // sum of inputs - transactionBytes * feePerByte
      expect(cs.effectiveBalance(0, inputs, outputs).value).toEqual(45000)
    })
    it('should return the right effective max balance with value and empty valued outputs', () => {
      const inputs = map(Coin.fromJS, [{ value: 15000 }, { value: 10000 }, { value: 20000 }])

      const outputs = map(Coin.fromJS, [{ value: 0 }, { value: 0 }])

      // sum of inputs - transactionBytes * feePerByte
      // 45000 - 55 * (10 + 3*148 + 2*34) = 45000 - ceil(28710) = 16290
      expect(cs.effectiveBalance(55, inputs, outputs).value).toEqual(16290)
    })
    it('should return the right effective max balance with value and empty valued outputs (segwit)', () => {
      const inputs = map(Coin.fromJS, [
        { address: 'bc1qxddx2wmn97swgznpkthv940ktg8ycxg0ygxxp9', value: 15000 },
        { address: 'bc1qxddx2wmn97swgznpkthv940ktg8ycxg0ygxxp9', value: 10000 },
        { value: 20000 }
      ])

      const outputs = map(Coin.fromJS, [{ value: 0 }, { value: 0 }])

      // sum of inputs - transactionBytes * feePerByte
      // 45000 - 55 * (10.75 + 2*67.75 + 148 + 2*34) = 45000 - ceil(19923.75) = 25076
      expect(cs.effectiveBalance(55, inputs, outputs).value).toEqual(25076)
    })
    it('should return the right effective max balance w/ no inputs or outputs', () => {
      expect(cs.effectiveBalance(55, [], []).value).toEqual(0)
    })
    it('should return the right effective max balance w/ no value, inputs or outputs', () => {
      expect(cs.effectiveBalance(0, [], []).value).toEqual(0)
    })
  })

  describe('findTarget', () => {
    it('should return the right selection with empty inputs and targets,', () => {
      const selection = cs.findTarget([], 0, [])
      expect(selection.fee).toEqual(0)
      expect(selection.inputs).toEqual([])
      expect(selection.outputs).toEqual([])
    })
    it('should return the right selection without feePerByte set', () => {
      const inputs = map(Coin.fromJS, [{ value: 1 }, { value: 2 }, { value: 3 }])
      const targets = map(Coin.fromJS, [{ value: 10000 }])
      const selection = cs.findTarget(targets, 0, inputs)
      expect(selection.fee).toEqual(0)
      expect(selection.inputs).toEqual([])
      expect(selection.outputs).toEqual(targets)
    })
    it('should return the right selection with feePerByte set', () => {
      const inputs = map(Coin.fromJS, [{ value: 1 }, { value: 20000 }, { value: 300000 }])
      const targets = map(Coin.fromJS, [{ value: 10000 }])
      const feePerByte = 55
      const selection = cs.findTarget(targets, feePerByte, inputs)

      const estimatedSize = 10 + 2 * 148 + 34 * 2 // 374
      const estimatedFee = estimatedSize * feePerByte // 20570
      const feeForAdditionalChangeOutput = cs.IO_TYPES.outputs.P2PKH * feePerByte

      expect(selection.fee).toEqual(estimatedFee)
      expect(selection.inputs.map((x) => x.value)).toEqual([20000, 300000])
      expect(selection.outputs.map((x) => x.value)).toEqual([
        10000,
        300000 + 20000 - 10000 - estimatedFee + feeForAdditionalChangeOutput
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
      expect(selection.inputs.map((x) => x.value)).toEqual([20000, 300000])

      // overhead + inputs + outputs
      // 55 * (10 + 148 * 2 + 34 * 1) = 55 * 340 = 18700
      expect(selection.fee).toEqual(18700)

      // change = inputs - outputs - fee
      // 20000 + 300000 - 18700 = 301300
      expect(selection.outputs.map((x) => x.value)).toEqual([301300])
    })
    it('should return the right selection without inputs', () => {
      const inputs = map(Coin.fromJS, [])
      const selection = cs.selectAll(55, inputs)
      expect(selection.fee).toEqual(0)
      expect(selection.inputs.map((x) => x.value)).toEqual([])
      expect(selection.outputs.map((x) => x.value)).toEqual([0])
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
      expect(selection.inputs.map((x) => x.value)).toEqual([20000, 300000])

      // overhead + inputs + outputs
      // 55 * (10 + 148 * 2 + 34 * 2) = 20570
      expect(selection.fee).toEqual(20570)
      // change = inputs - outputs - fee + feeForAdditionalChangeOutput
      // 20000 + 300000 - 100000 - 20570 + 1870 = 201300
      expect(selection.outputs.map((x) => x.value)).toEqual([100000, 201300])
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
      expect(selection.inputs.map((x) => x.value)).toEqual([20000, 300000])

      // overhead + inputs + outputs
      // 55 * (10 + 148 * 2 + 34 * 2) = 20570
      expect(selection.fee).toEqual(20570)

      // change = inputs - outputs - fee
      // 20000 + 300000 - 100000 - 20570 + 1870 = 201300
      expect(selection.outputs.map((x) => x.value)).toEqual([100000, 201300])
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
      const selection = cs.singleRandomDraw(targets, 55, inputs, 'change-address', seed)
      expect(selection.fee).toEqual(20000)
      expect(selection.inputs.map((x) => x.value)).toEqual([30000, 50000])
      expect(selection.outputs.map((x) => x.value)).toEqual([60000])
    })
  })
})
