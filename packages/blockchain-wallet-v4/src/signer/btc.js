import { curry, compose, lensProp,
  map, forEach, addIndex, defaultTo, set, over } from 'ramda'
import { traversed, traverseOf, mapped } from 'ramda-lens'
import Bitcoin from 'bitcoinjs-lib'
import Task from 'data.task'
import { Wrapper, Wallet } from '../types'
import * as Coin from '../coinSelection/coin.js'

export const signSelection = curry((network, selection) => {
  const tx = new Bitcoin.TransactionBuilder(network)
  const addInput = coin => tx.addInput(coin.txHash, coin.index)
  const addOutput = coin =>
    tx.addOutput(defaultTo(coin.address, coin.script), coin.value)
  const sign = (coin, i) => tx.sign(i, coin.priv)
  forEach(addInput, selection.inputs)
  forEach(addOutput, selection.outputs)
  addIndex(forEach)(sign, selection.inputs)
  return tx.build().toHex()
})

// signHDWallet :: network -> password -> wrapper -> selection -> Task selection
export const signHDWallet = curry((network, secondPassword, wrapper, selection) => {
  const wallet = Wrapper.selectWallet(wrapper)
  const deriveKey = coin =>
    Wallet.getHDPrivateKeyWIF(coin.path, secondPassword, network, wallet)
      .map(wif => Bitcoin.ECPair.fromWIF(wif, network))
      .map(k => set(Coin.priv, k, coin))
  const selectionWithKeys = traverseOf(
    compose(lensProp('inputs'), traversed), Task.of, deriveKey, selection)
  return map(signSelection(network), selectionWithKeys)
})

// signLegacy :: network -> password -> wrapper -> selection -> Task selection
export const signLegacy = curry((network, secondPassword, wrapper, selection) => {
  const wallet = Wrapper.selectWallet(wrapper)
  const getPriv = coin =>
    Wallet.getLegacyPrivateKey(coin.address, secondPassword, network, wallet)
      .map(k => set(Coin.priv, k, coin))
  const selectionWithKeys = traverseOf(
    compose(lensProp('inputs'), traversed), Task.of, getPriv, selection)
  return map(signSelection(network), selectionWithKeys)
})

// signWithWIF :: network -> selection -> selection
export const signWithWIF = curry((network, selection) => {
  const selectionWithKeys = over(
    compose(lensProp('inputs'), mapped, Coin.priv),
    wif => Bitcoin.ECPair.fromWIF(wif, network),
    selection
  )
  return signSelection(network, selectionWithKeys)
})
