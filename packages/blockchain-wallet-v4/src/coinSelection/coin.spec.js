import { List } from 'immutable-ext'
import { map } from 'ramda'

import * as Coin from './coin.js'

describe('Coin Selection', () => {
  describe('Coin Type', () => {
    it('coins monoid both valued', () => {
      const A = Coin.fromJS({ value: 100 })
      const B = Coin.fromJS({ value: 300 })
      expect(A.concat(B).value).toEqual(400)
    })
    it('coins monoid one valued', () => {
      const coins = map(Coin.fromJS, [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
        { value: 8 },
        { value: 9 },
        { value: 10 }
      ])
      const sum = List(coins).fold(Coin.empty).value
      expect(sum).toEqual(55)
    })
    it('coins setoid both valued', () => {
      const A = Coin.fromJS({ value: 100 })
      const B = Coin.fromJS({ value: 100 })
      expect(A.equals(B)).toEqual(true)
    })
    it('coins setoid one valued', () => {
      const A = Coin.fromJS({ value: 100 })
      const B = Coin.fromJS({ value: 0 })
      expect(A.equals(B)).toEqual(false)
      expect(A.lte(B)).toEqual(false)
    })
    it('coins setoid one valued lte', () => {
      const A = Coin.fromJS({ value: 0 })
      const B = Coin.fromJS({ value: 100 })
      expect(A.lte(B)).toEqual(true)
    })
    it('coins map', () => {
      const A = Coin.fromJS({ value: 100 })
      const square = x => x * x
      expect(A.overValue(square).value).toEqual(square(A.value))
    })
    it('coin empty', () => {
      const A = Coin.empty
      expect(A.value).toEqual(0)
    })
  })
  describe('coin byte sizes', () => {
    it('should return the right IO sizes for P2PKH', () => {
      expect(Coin.inputBytes({})).toEqual(148)
      expect(Coin.outputBytes({})).toEqual(34)
    })
    it('should return the right IO sizes for P2WPKH', () => {
      expect(Coin.inputBytes({ type: () => 'P2WPKH' })).toEqual(67.75)
      expect(Coin.outputBytes({ type: () => 'P2WPKH' })).toEqual(31)
    })
  })
  describe('effective values', () => {
    // value - feePerByte * input size
    it('should return the right coin value', () => {
      const A = Coin.fromJS({ value: 15000 })
      expect(Coin.effectiveValue(55, A)).toEqual(6860) // 15000 - 55 * 148 = 6860

      const B = Coin.fromJS({
        value: 15000,
        address: 'bc1qxddx2wmn97swgznpkthv940ktg8ycxg0ygxxp9'
      })
      expect(Coin.effectiveValue(55, B)).toEqual(11274) // 15000 - 55 * 67.75 = 11273.75
    })
    it('should return zero coin value', () => {
      expect(Coin.effectiveValue(55000, Coin.fromJS({ value: 15000 }))).toEqual(
        0
      )
    })
    it('should return max coin value', () => {
      expect(Coin.effectiveValue(0, Coin.fromJS({ value: 15000 }))).toEqual(
        15000
      )
    })
  })
})

describe('bip69SortInputs', () => {
  const { bip69SortInputs } = Coin
  it('should sort inputs by hash', () => {
    const assortedInputs = [
      {
        txHash:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        value: 1
      },
      {
        txHash:
          'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
        value: 2
      },
      {
        txHash:
          'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        value: 3
      },
      {
        txHash:
          'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbff',
        value: 4
      },
      {
        txHash:
          'ffbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        value: 5
      }
    ].map(input => new Coin.Coin(input))
    const sortedInputs = [
      {
        txHash:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        value: 1
      },
      {
        txHash:
          'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        value: 3
      },
      {
        txHash:
          'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbff',
        value: 4
      },
      {
        txHash:
          'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
        value: 2
      },
      {
        txHash:
          'ffbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        value: 5
      }
    ].map(input => new Coin.Coin(input))
    expect(bip69SortInputs(assortedInputs)).toEqual(sortedInputs)
  })

  it('should sort inputs with equal hash by value', () => {
    const assortedInputs = [
      {
        txHash:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        value: 1
      },
      {
        txHash:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        value: 0
      },
      {
        txHash:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        value: 3
      },
      {
        txHash:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        value: 10
      },
      {
        txHash:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        value: 2
      }
    ].map(input => new Coin.Coin(input))
    const sortedInputs = [
      {
        txHash:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        value: 0
      },
      {
        txHash:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        value: 1
      },
      {
        txHash:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        value: 2
      },
      {
        txHash:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        value: 3
      },
      {
        txHash:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        value: 10
      }
    ].map(input => new Coin.Coin(input))
    expect(bip69SortInputs(assortedInputs)).toEqual(sortedInputs)
  })
})

describe('bip69SortOutputs', () => {
  const { bip69SortOutputs } = Coin
  it('should sort ouputs by value', () => {
    const assortedOutputs = [
      {
        script: '00000000',
        value: 1
      },
      {
        script: '11111111',
        value: 0
      },
      {
        script: '00000000',
        value: 3
      },
      {
        script: '11111111',
        value: 10
      },
      {
        script: '22222222',
        value: 2
      }
    ].map(
      output =>
        new Coin.Coin({
          ...output,
          script: Buffer.from(output.script, 'hex')
        })
    )
    const sortedOutputs = [
      {
        script: '11111111',
        value: 0
      },
      {
        script: '00000000',
        value: 1
      },
      {
        script: '22222222',
        value: 2
      },
      {
        script: '00000000',
        value: 3
      },
      {
        script: '11111111',
        value: 10
      }
    ].map(
      output =>
        new Coin.Coin({
          ...output,
          script: Buffer.from(output.script, 'hex')
        })
    )
    expect(bip69SortOutputs(assortedOutputs)).toEqual(sortedOutputs)
  })

  it('should sort outups with equal value by script', () => {
    const assortedOutputs = [
      {
        script: '00000000',
        value: 0
      },
      {
        script: '11111111',
        value: 0
      },
      {
        script: '00000000',
        value: 0
      },
      {
        script: '11111111',
        value: 0
      },
      {
        script: '22222222',
        value: 0
      }
    ].map(
      output =>
        new Coin.Coin({
          ...output,
          script: Buffer.from(output.script, 'hex')
        })
    )
    const sortedOutputs = [
      {
        script: '00000000',
        value: 0
      },
      {
        script: '00000000',
        value: 0
      },
      {
        script: '11111111',
        value: 0
      },
      {
        script: '11111111',
        value: 0
      },
      {
        script: '22222222',
        value: 0
      }
    ].map(
      output =>
        new Coin.Coin({
          ...output,
          script: Buffer.from(output.script, 'hex')
        })
    )
    expect(bip69SortOutputs(assortedOutputs)).toEqual(sortedOutputs)
  })
})
