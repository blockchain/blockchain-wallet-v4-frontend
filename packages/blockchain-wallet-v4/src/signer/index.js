import { curry, compose, lensProp, map, forEach, addIndex, defaultTo } from 'ramda'
import { traversed, traverseOf } from 'ramda-lens'
import Bitcoin from 'bitcoinjs-lib'
import BitcoinCash from 'bitcoinforksjs-lib'
import BigNumber from 'bignumber.js'
import EthereumTx from 'ethereumjs-tx'
import Task from 'data.task'
import { Wrapper, Wallet } from '../types'
import * as Coin from '../coinSelection/coin.js'
import * as btc from '../utils/bitcoin'
import * as eth from '../utils/ethereum'
import { fromCashAddr, isCashAddr } from '../utils/bch'
// import memoize from 'fast-memoize'
// import shuffle from 'fisher-yates'
// import { List } from 'immutable-ext'
// import seedrandom from 'seedrandom'

export const isFromAccount = selection => selection.inputs[0] ? selection.inputs[0].isFromAccount : false
export const isFromLegacy = selection => selection.inputs[0] ? selection.inputs[0].isFromLegacy : false
export const hasPrivateKey = selection => selection.inputs[0] ? btc.isValidBitcoinPrivateKey(selection.inputs[0].priv) : false

export const signBtcSelection = curry((network, selection) => {
  const tx = new Bitcoin.TransactionBuilder(network)
  const addInput = coin => tx.addInput(coin.txHash, coin.index)
  const addOutput = coin => tx.addOutput(defaultTo(coin.address, coin.script), coin.value)
  const sign = (coin, i) => tx.sign(i, coin.priv)
  forEach(addInput, selection.inputs)
  forEach(addOutput, selection.outputs)
  addIndex(forEach)(sign, selection.inputs)
  return tx.build().toHex()
})

export const signBchSelection = curry((network, selection) => {
  const hashType = BitcoinCash.Transaction.SIGHASH_ALL | BitcoinCash.Transaction.SIGHASH_BITCOINCASHBIP143

  const tx = new BitcoinCash.TransactionBuilder(network)
  tx.enableBitcoinCash(true)

  const addInput = coin => tx.addInput(coin.txHash, coin.index, BitcoinCash.Transaction.DEFAULT_SEQUENCE)
  const addOutput = coin => tx.addOutput(isCashAddr(coin.address) ? fromCashAddr(coin.address) : coin.address, coin.value)
  const sign = (coin, i) => tx.sign(i, coin.priv, null, hashType, coin.value)

  forEach(addInput, selection.inputs)
  forEach(addOutput, selection.outputs)
  addIndex(forEach)(sign, selection.inputs)

  return tx.build().toHex()
})

// returns a task
export const sign = curry((coin, network, secondPassword, wrapper, selection) => {
  const BitcoinLib = coin === 'BTC' ? Bitcoin : BitcoinCash
  const wallet = Wrapper.selectWallet(wrapper)
  const pathToKey = keypath => Wallet.getHDPrivateKey(BitcoinLib, keypath, secondPassword, network, wallet)
  const getPriv = address => Wallet.getLegacyPrivateKey(address, secondPassword, network, wallet)
  const mapPriv = priv => Task.of(priv).map(pk => btc.privateKeyStringToKey(pk, btc.detectPrivateKeyFormat(pk)))
  const getKeys = hasPrivateKey(selection) ? mapPriv : isFromAccount(selection) ? pathToKey : getPriv
  const selectionWithKeys = traverseOf(compose(lensProp('inputs'), traversed, Coin.priv), Task.of, getKeys, selection)
  return coin === 'BTC'
    ? map(signBtcSelection(network), selectionWithKeys)
    : map(signBchSelection(network), selectionWithKeys)
})

// export const signFromWatchOnly = curry((network, keyString, selection) => {
//   // TODO :: convert from string to ECKey
//   const mykey = ''
//   const selectionWithKeys = Task.of(set(compose(lensProp('inputs'), mapped, Coin.priv), mykey, selection))
//   return map(signSelection(network), selectionWithKeys)
// })
// //////////////////////////////////////////////////////////////////////////////

// Ethereum (we must organize eth/btc folders)
/**
 * @param {integer} network - The ethereum network
 * @param {string} secondPassword - The second password
 * @param {object} wrapper - The wallet payload
 * @param {object} data - The ethereum transaction data (from, index, to, amount, nonce, gasPrice, gasLimit)
 */
export const signETH = curry((network, mnemonic, data) => {
  const { nonce, gasPrice, gasLimit, to, amount, from } = data
  const privateKey = eth.getPrivateKey(mnemonic, from.index).getWallet().getPrivateKey()
  const txParams = {
    to,
    nonce: toHex(nonce),
    gasPrice: toHex(gasPrice),
    gasLimit: toHex(gasLimit),
    value: toHex(amount),
    chainId: network || 1
  }
  const tx = new EthereumTx(txParams)
  tx.sign(privateKey)
  const rawTx = '0x' + tx.serialize().toString('hex')
  return Task.of(rawTx)
})

const isOdd = str => str.length % 2 !== 0

/**
 * @param {string|number} value - The number to convert
 */
const toHex = value => {
  const hex = new BigNumber(value).toString(16)
  return isOdd(hex) ? `0x0${hex}` : `0x${hex}`
}
