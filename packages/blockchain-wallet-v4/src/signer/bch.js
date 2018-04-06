import { curry, compose, lensProp, map, forEach, addIndex } from 'ramda'
import { traversed, traverseOf } from 'ramda-lens'
import BitcoinCash from 'bitcoinforksjs-lib'
import Task from 'data.task'
import { Wrapper, Wallet } from '../types'
import * as Coin from '../coinSelection/coin.js'
import { isFromAccount } from '../coinSelection'
import { fromCashAddr, isCashAddr } from '../utils/bch'

export const signSelection = curry((network, selection) => {
  const hashType =
    BitcoinCash.Transaction.SIGHASH_ALL |
    BitcoinCash.Transaction.SIGHASH_BITCOINCASHBIP143
  const tx = new BitcoinCash.TransactionBuilder(network)
  tx.enableBitcoinCash(true)
  const addInput = coin =>
    tx.addInput(coin.txHash, coin.index, BitcoinCash.Transaction.DEFAULT_SEQUENCE)
  const addOutput = coin =>
    tx.addOutput(isCashAddr(coin.address)
      ? fromCashAddr(coin.address)
      : coin.address, coin.value)
  const sign = (coin, i) => tx.sign(i, coin.priv, null, hashType, coin.value)
  forEach(addInput, selection.inputs)
  forEach(addOutput, selection.outputs)
  addIndex(forEach)(sign, selection.inputs)
  return tx.build().toHex()
})

// returns a task
export const sign = curry((network, secondPassword, wrapper, selection) => {
  const wallet = Wrapper.selectWallet(wrapper)
  const pathToKey = keypath =>
    Wallet.getHDPrivateKeyWIF(keypath, secondPassword, network, wallet)
      .map(wif => BitcoinCash.ECPair.fromWIF(wif, network))
  const getPriv = address =>
    Wallet.getLegacyPrivateKey(address, secondPassword, network, wallet)
  const getKeys = isFromAccount(selection) ? pathToKey : getPriv
  const selectionWithKeys = traverseOf(
    compose(lensProp('inputs'), traversed, Coin.priv),
    Task.of,
    getKeys,
    selection)
  return map(signSelection(network), selectionWithKeys)
})
