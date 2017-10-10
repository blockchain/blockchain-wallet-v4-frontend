import { curry, compose, lensProp, map, forEach, addIndex } from 'ramda'
import { traversed, traverseOf } from 'ramda-lens'
import Bitcoin from 'bitcoinjs-lib'
import Task from 'data.task'
import { Wrapper, Wallet } from '../types'
import * as Coin from '../coinSelection/coin.js'
// import memoize from 'fast-memoize'
// import shuffle from 'fisher-yates'
// import { List } from 'immutable-ext'
// import seedrandom from 'seedrandom'

export const isFromAccount = selection => selection.inputs[0] ? selection.inputs[0].isFromAccount : false
export const isFromLegacy = selection => selection.inputs[0] ? selection.inputs[0].isFromLegacy : false

export const signSelection = curry((network, selection) => {
  const tx = new Bitcoin.TransactionBuilder(network)
  const addInput = coin => tx.addInput(coin.txHash, coin.index)
  const addOutput = coin => tx.addOutput(coin.address, coin.value)
  const sign = (coin, i) => tx.sign(i, coin.priv)
  forEach(addInput, selection.inputs)
  forEach(addOutput, selection.outputs)
  addIndex(forEach)(sign, selection.inputs)
  return tx.build().toHex()
})

// returns a task
export const sign = curry((network, secondPassword, wrapper, selection) => {
  const wallet = Wrapper.selectWallet(wrapper)
  const pathToKey = keypath => Wallet.getHDPrivateKey(keypath, secondPassword, network, wallet)
  const getPriv = address => Wallet.getLegacyPrivateKey(address, secondPassword, network, wallet)
  const getKeys = isFromAccount(selection) ? pathToKey : getPriv
  const selectionWithKeys = traverseOf(compose(lensProp('inputs'), traversed, Coin.priv), Task.of, getKeys, selection)
  return map(signSelection(network), selectionWithKeys)
})

// export const signFromWatchOnly = curry((network, keyString, selection) => {
//   // TODO :: convert from string to ECKey
//   const mykey = ''
//   const selectionWithKeys = Task.of(set(compose(lensProp('inputs'), mapped, Coin.priv), mykey, selection))
//   return map(signSelection(network), selectionWithKeys)
// })
