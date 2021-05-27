import { inputComparator, sortOutputs } from 'bip69'
import * as Bitcoin from 'bitcoinjs-lib'
import { clamp, curry, is, length, sort, split } from 'ramda'
import { over, view } from 'ramda-lens'

import Type from '../types/Type'
import { addressToScript, scriptToAddress } from '../utils/btc'
import { IO_TYPES } from './index'

export const TX_EMPTY_SIZE = 4 + 1 + 1 + 4
export const TX_INPUT_BASE = 32 + 4 + 1 + 4
export const TX_INPUT_PUBKEYHASH = 106
export const TX_OUTPUT_BASE = 8 + 1
export const TX_OUTPUT_PUBKEYHASH = 25

export class Coin extends Type {
  toString() {
    return `Coin(${this.value})`
  }

  concat(coin) {
    return new Coin({ value: this.value + coin.value })
  }

  equals(coin) {
    return this.value === coin.value
  }

  lte(coin) {
    return this.value <= coin.value
  }

  ge(coin) {
    return this.value >= coin.value
  }

  overValue(f) {
    // eslint-disable-next-line
    return over(value, f, this)
  }

  isFromAccount() {
    return length(split('/', this.priv)) > 1
  }

  isFromLegacy() {
    return !this.isFromAccount()
  }

  type() {
    let type = 'P2PKH'
    try {
      const output = Bitcoin.address.toOutputScript(this.address)
      // TODO: is addr var even needed doesnt seem to be used?
      // eslint-disable-next-line
      let addr = null

      try {
        // eslint-disable-next-line
        addr = Bitcoin.payments.p2pkh({ output }).address
        type = 'P2PKH'
        // eslint-disable-next-line
      } catch (e) {}
      try {
        // eslint-disable-next-line
        addr = Bitcoin.payments.p2sh({ output }).address
        type = 'P2SH'
        // eslint-disable-next-line
      } catch (e) {}
      try {
        // eslint-disable-next-line
        addr = Bitcoin.payments.p2wpkh({ output }).address
        type = 'P2WPKH'
        // eslint-disable-next-line
      } catch (e) {}
      try {
        // eslint-disable-next-line
        addr = Bitcoin.payments.p2wsh({ output }).address
        type = 'P2WSH'
        // eslint-disable-next-line
      } catch (e) {}
      // eslint-disable-next-line
    } catch (e) {}

    return type
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
    address: o.address ? o.address : scriptToAddress(o.script, network),
    change: o.change || false,
    index: o.tx_output_n,
    path: o.path,
    priv: o.priv,
    script: o.script ? o.script : addressToScript(o.address, network),
    txHash: o.tx_hash_big_endian,
    // eslint-disable-next-line
    value: parseInt(o.value),
    xpub: o.xpub
  })
}

export const empty = new Coin({ value: 0 })

export const inputBytes = (input) => {
  return IO_TYPES.inputs[input.type ? input.type() : 'P2PKH']
}

export const outputBytes = (output) => {
  return IO_TYPES.outputs[output.type ? output.type() : 'P2PKH']
}

export const effectiveValue = curry((feePerByte, coin) =>
  clamp(0, Infinity, Math.ceil(coin.value - feePerByte * inputBytes(coin)))
)

export const bip69SortInputs = sort((inputA, inputB) =>
  inputComparator(inputA.txHash, inputA.value, inputB.txHash, inputB.value)
)
export const bip69SortOutputs = sortOutputs
