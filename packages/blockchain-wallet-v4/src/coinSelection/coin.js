import { inputComparator, sortOutputs } from 'bip69'
import {
  add,
  always,
  clamp,
  complement,
  compose,
  curry,
  ifElse,
  is,
  length,
  sort,
  split,
  tryCatch
} from 'ramda'
import { over, view } from 'ramda-lens'

import Type from '../types/Type'
import { addressToScript, scriptToAddress } from '../utils/btc'

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
    return over(value, f, this)
  }
  isFromAccount() {
    return length(split('/', this.priv)) > 1
  }
  isFromLegacy() {
    return !this.isFromAccount()
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
  // const coin = isCoin(input) ? input : new Coin(input)
  // return TX_INPUT_BASE + (isNil(coin.script) ? TX_INPUT_PUBKEYHASH : coin.script.length)
  return TX_INPUT_BASE + TX_INPUT_PUBKEYHASH
}

export const outputBytes = ifElse(
  complement(isCoin),
  always(TX_OUTPUT_BASE + TX_OUTPUT_PUBKEYHASH),
  compose(
    add(TX_OUTPUT_BASE),
    tryCatch(
      compose(s => s.length, selectScript),
      always(TX_OUTPUT_PUBKEYHASH)
    )
  )
)

export const effectiveValue = curry((feePerByte, coin) =>
  clamp(0, Infinity, coin.value - feePerByte * inputBytes(coin))
)

export const bip69SortInputs = sort((inputA, inputB) =>
  inputComparator(inputA.txHash, inputA.value, inputB.txHash, inputB.value)
)
export const bip69SortOutputs = sortOutputs
