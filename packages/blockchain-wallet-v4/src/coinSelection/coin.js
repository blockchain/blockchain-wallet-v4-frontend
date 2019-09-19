import { curry, is, clamp, split, length, sort } from 'ramda'
import { over, view } from 'ramda-lens'
import { inputComparator, sortOutputs } from 'bip69'
import Type from '../types/Type'
import { addressToScript, scriptToAddress } from '../utils/btc'
import { IO_TYPES } from './'

export class Coin extends Type {
  toString () {
    return `Coin(${this.value})`
  }
  concat (coin) {
    return new Coin({ value: this.value + coin.value })
  }
  equals (coin) {
    return this.value === coin.value
  }
  lte (coin) {
    return this.value <= coin.value
  }
  ge (coin) {
    return this.value >= coin.value
  }
  overValue (f) {
    return over(value, f, this)
  }
  isFromAccount () {
    return length(split('/', this.priv)) > 1
  }
  isFromLegacy () {
    return !this.isFromAccount()
  }
  type () {
    try {
      switch (this.address[0]) {
        case '1':
          return 'P2PKH'
        case '3':
          return 'P2SH-P2WPKH'
        default:
          return 'P2PKH'
      }
    } catch (e) {
      return 'P2PKH'
    }
  }
}

export const isCoin = is(Coin)
export const value = Coin.define('value')
export const script = Coin.define('script')
export const txHash = Coin.define('txHash')
export const index = Coin.define('index')
export const address = Coin.define('address')
export const priv = Coin.define('priv')
export const change = Coin.define('change')
export const path = Coin.define('path')

export const selectValue = view(value)
export const selectScript = view(script)
export const selectTxHash = view(txHash)
export const selectIndex = view(index)
export const selectAddress = view(address)
export const selectPriv = view(priv)
export const selectChange = view(change)
export const selectPath = view(path)

export const fromJS = (o, network) => {
  return new Coin({
    value: parseInt(o.value),
    script: o.script ? o.script : addressToScript(o.address, network),
    txHash: o.tx_hash_big_endian,
    index: o.tx_output_n,
    change: o.change || false,
    priv: o.priv,
    path: o.path,
    xpub: o.xpub,
    address: o.address ? o.address : scriptToAddress(o.script, network)
  })
}

export const empty = new Coin({ value: 0 })

export const inputBytes = input => {
  return Math.ceil(IO_TYPES.inputs[input.type ? input.type() : 'P2PKH'] / 4)
}

export const outputBytes = output => {
  return Math.ceil(IO_TYPES.outputs[output.type ? output.type() : 'P2PKH'] / 4)
}

export const effectiveValue = curry((feePerByte, coin) =>
  clamp(0, Infinity, coin.value - feePerByte * inputBytes(coin))
)

export const bip69SortInputs = sort((inputA, inputB) =>
  inputComparator(inputA.txHash, inputA.value, inputB.txHash, inputB.value)
)
export const bip69SortOutputs = sortOutputs
