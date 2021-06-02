import memoize from 'fast-memoize'
import shuffle from 'fisher-yates'
import { List } from 'immutable-ext'
import {
  clamp,
  curry,
  filter,
  head,
  is,
  isEmpty,
  isNil,
  last,
  map,
  reduce,
  sort,
  tail,
  unfold
} from 'ramda'
import seedrandom from 'seedrandom'

import * as Coin from './coin.js'

// getByteCount implementation
// based on https://gist.github.com/junderw/b43af3253ea5865ed52cb51c200ac19c
// Usage:
// - getByteCount({'P2WPKH':45},{'P2PKH':1}) Means "45 inputs of P2WPKH and 1 output of P2PKH"
// - getByteCount({'P2PKH':1,'P2WPKH':2},{'P2PKH':2}) means "1 P2PKH input and 2 P2WPKH inputs along with 2 P2PKH outputs"

// assumes compressed pubkeys in all cases.
// TODO: SEGWIT  we need to account for uncompressed pubkeys!
export const IO_TYPES = {
  inputs: {
    P2PKH: 148, // legacy
    P2WPKH: 67.75 // native segwit
  },
  outputs: {
    P2PKH: 34,
    P2SH: 32,
    P2WPKH: 31,
    P2WSH: 43
  }
}
const VBYTES_PER_WEIGHT_UNIT = 4

// isFromAccount :: selection -> boolean
export const isFromAccount = (selection) =>
  selection.inputs[0] ? selection.inputs[0].isFromAccount() : false

// isFromLegacy :: selection -> boolean
export const isFromLegacy = (selection) =>
  selection.inputs[0] ? selection.inputs[0].isFromLegacy() : false

export const dustThreshold = (feeRate, change) =>
  Math.ceil((Coin.inputBytes(change) + Coin.outputBytes(change)) * feeRate)

export const getByteCount = (inputs, outputs) => {
  let vBytesTotal = 0
  let hasWitness = false
  let inputCount = 0
  let outputCount = 0
  // assumes compressed pubkeys in all cases.

  function checkUInt53(n) {
    if (n < 0 || n > Number.MAX_SAFE_INTEGER || n % 1 !== 0)
      throw new RangeError('value out of range')
  }

  function varIntLength(number) {
    checkUInt53(number)

    return number < 0xfd ? 1 : number <= 0xffff ? 3 : number <= 0xffffffff ? 5 : 9
  }

  Object.keys(inputs).forEach(function (key) {
    checkUInt53(inputs[key])
    vBytesTotal += IO_TYPES.inputs[key] * inputs[key]
    inputCount += inputs[key]
    if (key.indexOf('W') >= 0) hasWitness = true
  })

  Object.keys(outputs).forEach(function (key) {
    checkUInt53(outputs[key])
    vBytesTotal += IO_TYPES.outputs[key] * outputs[key]
    outputCount += outputs[key]
  })

  // segwit marker + segwit flag + witness element count
  let overhead = hasWitness ? 0.25 + 0.25 + varIntLength(inputCount) / VBYTES_PER_WEIGHT_UNIT : 0

  overhead += 4 // nVersion
  overhead += varIntLength(inputCount)
  overhead += varIntLength(outputCount)
  overhead += 4 // nLockTime

  vBytesTotal += overhead
  return vBytesTotal
}

export const transactionBytes = (inputs, outputs) => {
  const coinTypeReducer = (acc, coin) => {
    const type = coin.type ? coin.type() : 'P2PKH'
    if (acc[type]) acc[type] += 1
    else acc[type] = 1
    return acc
  }

  const inputTypeCollection = reduce(coinTypeReducer, {}, inputs)
  const outputTypeCollection = reduce(coinTypeReducer, {}, outputs)
  return getByteCount(inputTypeCollection, outputTypeCollection)
}

export const changeBytes = (type) => IO_TYPES.outputs[type]

export const effectiveBalance = curry((feePerByte, inputs, outputs = [{}]) =>
  List(inputs)
    .fold(Coin.empty)
    .overValue((v) =>
      clamp(0, Infinity, v - Math.ceil(transactionBytes(inputs, outputs) * feePerByte))
    )
)

// findTarget :: [Coin(x), ..., Coin(y)] -> Number -> [Coin(a), ..., Coin(b)] -> Selection
const ft = (targets, feePerByte, coins, changeAddress) => {
  const target = List(targets).fold(Coin.empty).value
  const _findTarget = (seed) => {
    const acc = seed[0]
    const newCoin = head(seed[2])
    if (isNil(newCoin) || acc > target + seed[1]) {
      return false
    }
    const partialFee = seed[1] + Coin.inputBytes(newCoin) * feePerByte
    const restCoins = tail(seed[2])
    const nextAcc = acc + newCoin.value
    return acc > target + partialFee
      ? false
      : [
          [nextAcc, partialFee, newCoin],
          [nextAcc, partialFee, restCoins]
        ]
  }
  const partialFee = Math.ceil(transactionBytes([], targets) * feePerByte)
  const effectiveCoins = filter((c) => Coin.effectiveValue(feePerByte, c) > 0, coins)
  const selection = unfold(_findTarget, [0, partialFee, effectiveCoins])
  if (isEmpty(selection)) {
    // no coins to select
    return { fee: 0, inputs: [], outputs: [] }
  }
  const maxBalance = last(selection)[0]
  const fee = last(selection)[1]
  const selectedCoins = map((e) => e[2], selection)
  if (maxBalance < target + fee) {
    // not enough money to satisfy target
    return { fee, inputs: [], outputs: targets }
  }
  const extra = maxBalance - target - fee
  const change = Coin.fromJS({
    address: changeAddress,
    change: true,
    value: extra
  })
  // should we add change?
  if (extra >= dustThreshold(feePerByte, change)) {
    const feeForAdditionalChangeOutput = changeBytes(change.type()) * feePerByte
    return {
      fee: fee + feeForAdditionalChangeOutput,
      inputs: selectedCoins,
      outputs: [...targets, change]
    }
  }
  // burn change
  return { fee: fee + extra, inputs: selectedCoins, outputs: targets }
}
export const findTarget = memoize(ft)

// singleRandomDraw :: Number -> [Coin(a), ..., Coin(b)] -> String -> Selection
export const selectAll = (feePerByte, coins, outAddress) => {
  const effectiveCoins = filter((c) => Coin.effectiveValue(feePerByte, c) > 0, coins)
  const effBalance = effectiveBalance(feePerByte, effectiveCoins).value
  const Balance = List(effectiveCoins).fold(Coin.empty).value
  const fee = Balance - effBalance
  return {
    fee,
    inputs: effectiveCoins,
    outputs: [Coin.fromJS({ address: outAddress, value: effBalance })]
  }
}
// singleRandomDraw :: [Coin(x), ..., Coin(y)] -> Number -> [Coin(a), ..., Coin(b)] -> String -> Selection
export const singleRandomDraw = (targets, feePerByte, coins, changeAddress, seed) => {
  const rng = is(String, seed) ? seedrandom(seed) : undefined
  return findTarget(targets, feePerByte, shuffle(coins, rng), changeAddress)
}

// descentDraw :: [Coin(x), ..., Coin(y)] -> Number -> [Coin(a), ..., Coin(b)] -> Selection
export const descentDraw = (targets, feePerByte, coins, changeAddress) =>
  findTarget(
    targets,
    feePerByte,
    sort((a, b) => a.lte(b), coins),
    changeAddress
  )
// ascentDraw :: [Coin(x), ..., Coin(y)] -> Number -> [Coin(a), ..., Coin(b)] -> Selection
export const ascentDraw = (targets, feePerByte, coins, changeAddress) =>
  findTarget(
    targets,
    feePerByte,
    sort((a, b) => b.lte(a), coins),
    changeAddress
  )
