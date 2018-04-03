// @flow
import {curry, is, drop, clamp, split, length, add, compose, view,
  isNil, ifElse, always, complement, either, tryCatch, over, lensProp} from 'ramda'
import {addressToScript} from '../utils/bitcoin'

export const TX_EMPTY_SIZE = 4 + 1 + 1 + 4
export const TX_INPUT_BASE = 32 + 4 + 1 + 4
export const TX_INPUT_PUBKEYHASH = 106
export const TX_OUTPUT_BASE = 8 + 1
export const TX_OUTPUT_PUBKEYHASH = 25

export type CoinJS = {
  value: number,
  script?: ?string,
  tx_hash_big_endian?: string,
  tx_output_n?: number,
  change?: boolean,
  priv?: string,
  xpub?: {
    index: number,
    path: string
  },
  address?: string
}

export class Coin {
  value: number
  script: ?string
  txHash: ?string
  index: ?number
  address: ?string
  priv: ?string
  change: boolean

  constructor (o: CoinJS) {
    this.value = parseInt(o.value)
    this.script = o.script ? o.script : addressToScript(o.address)
    this.txHash = o.tx_hash_big_endian
    this.index = o.tx_output_n
    this.change = o.change || false
    this.priv = o.priv || (o.xpub ? `${o.xpub.index}${drop(1, o.xpub.path)}` : undefined)
    this.address = o.address
  }

  toString () {
    return `Coin(${this.value})`
  }
  concat (coin: Coin) {
    return new Coin({value: this.value + coin.value})
  }
  equals (coin: Coin) {
    return this.value === coin.value
  }
  lte (coin: Coin) {
    return this.value <= coin.value
  }
  ge (coin: Coin) {
    return this.value >= coin.value
  }
  overValue <T> (f: Coin => T): T {
    return over(value, f, this)
  }
  isFromAccount (): boolean {
    return this.priv ? length(split('/', this.priv)) > 1 : false
  }
  isFromLegacy (): boolean {
    return !this.isFromAccount()
  }
}

export const isCoin = is(Coin)
export const value = lensProp('value')
export const script = lensProp('script')
export const txHash = lensProp('txHash')
export const index = lensProp('index')
export const address = lensProp('address')
export const priv = lensProp('priv')
export const change = lensProp('change')

export const selectValue = view(value)
export const selectScript = view(script)
export const selectTxHash = view(txHash)
export const selectIndex = view(index)
export const selectAddress = view(address)
export const selectPriv = view(priv)
export const selectChange = view(change)

export const fromJS = (o: Object) => {
  return new Coin(o)
}

export const empty = new Coin({value: 0})

export const inputBytes = (input: Coin) => {
  // const coin = isCoin(input) ? input : new Coin(input)
  // return TX_INPUT_BASE + (isNil(coin.script) ? TX_INPUT_PUBKEYHASH : coin.script.length)
  return TX_INPUT_BASE + TX_INPUT_PUBKEYHASH
}

export const outputBytes = ifElse(either(complement(isCoin), compose(isNil, selectAddress)),
  always(TX_OUTPUT_BASE + TX_OUTPUT_PUBKEYHASH),
  compose(
    add(TX_OUTPUT_BASE),
    tryCatch(
      compose(s => s.length, selectScript),
      always(TX_OUTPUT_PUBKEYHASH))))

export const effectiveValue = curry((feePerByte, coin: Coin) =>
  clamp(0, Infinity, coin.value - feePerByte * inputBytes(coin)))
