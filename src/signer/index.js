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

export const signSelection = selection => {
  const tx = new Bitcoin.TransactionBuilder()
  const addInput = coin => tx.addInput(coin.txHash, coin.index)
  const addOutput = coin => tx.addOutput(coin.address, coin.value)
  const sign = (coin, i) => tx.sign(i, coin.priv)
  forEach(addInput, selection.inputs)
  forEach(addOutput, selection.outputs)
  addIndex(forEach)(sign, selection.inputs)
  return tx.build().toHex()
}

export const signFromAccount = curry((network, secondPassword, wrapper, selection) => {
  let wallet = Wrapper.selectWallet(wrapper)
  let pathToKey = keypath => Wallet.getHDPrivateKey(keypath, secondPassword, network, wallet)
  const selectionWithKeys = traverseOf(compose(lensProp('inputs'), traversed, Coin.priv), Task.of, pathToKey, selection)
  return map(signSelection, selectionWithKeys)
})

export const signFromLegacyAddress = curry((network, secondPassword, wrapper, selection) => {
  let wallet = Wrapper.selectWallet(wrapper)
  let getPriv = address => Wallet.getLegacyPrivateKey(address, secondPassword, network, wallet)
  const selectionWithKeys = traverseOf(compose(lensProp('inputs'), traversed, Coin.priv), Task.of, getPriv, selection)
  return map(signSelection, selectionWithKeys)
})

// export const signFromWatchOnly = curry((network, keyString, selection) => {
//   // TODO :: convert from string to ECKey
//   const mykey = ''
//   const selectionWithKeys = Task.of(set(compose(lensProp('inputs'), mapped, Coin.priv), mykey, selection))
//   return map(signSelection, selectionWithKeys)
// })

// export const signFromTrezor = curry((network, ) => {
// })
