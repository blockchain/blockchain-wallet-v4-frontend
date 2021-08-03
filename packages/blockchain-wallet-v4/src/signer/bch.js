import BitcoinCash from 'bitcoinforksjs-lib'
import { addIndex, compose, curry, forEach, lensProp, over } from 'ramda'
import { mapped } from 'ramda-lens'

import * as Coin from '../coinSelection/coin'
import { fromCashAddr, isCashAddr } from '../utils/bch'
import { addHDWalletWIFS, addLegacyWIFS } from './wifs'

export const signSelection = curry((network, coinDust, selection) => {
  const hashType =
    BitcoinCash.Transaction.SIGHASH_ALL | BitcoinCash.Transaction.SIGHASH_BITCOINCASHBIP143
  const tx = new BitcoinCash.TransactionBuilder(network)
  tx.enableBitcoinCash(true)
  const addInput = (coin) =>
    tx.addInput(coin.txHash, coin.index, BitcoinCash.Transaction.DEFAULT_SEQUENCE)
  const addOutput = (coin) =>
    tx.addOutput(isCashAddr(coin.address) ? fromCashAddr(coin.address) : coin.address, coin.value)
  const sign = (coin, i) => tx.sign(i, coin.priv, null, hashType, coin.value)
  forEach(addInput, selection.inputs)
  forEach(addOutput, selection.outputs)
  // add dust input and output after original selection
  tx.addInput(coinDust.txHash, coinDust.index, BitcoinCash.Transaction.DEFAULT_SEQUENCE)
  tx.addOutput(coinDust.address, coinDust.value)
  addIndex(forEach)(sign, selection.inputs)
  const signedTx = tx.buildIncomplete()
  return { txHex: signedTx.toHex(), txId: signedTx.getId() }
})

export const sortSelection = (selection) => ({
  ...selection,
  inputs: Coin.bip69SortInputs(selection.inputs),
  outputs: Coin.bip69SortOutputs(selection.outputs)
})

// signHDWallet :: network -> password -> wrapper -> selection -> Task selection
export const signHDWallet = curry((network, secondPassword, wrapper, selection, coinDust) =>
  addHDWalletWIFS(network, secondPassword, wrapper, selection).map(signWithWIF(network, coinDust))
)

// signLegacy :: network -> password -> wrapper -> selection -> Task selection
export const signLegacy = curry((network, secondPassword, wrapper, selection, coinDust) =>
  addLegacyWIFS(network, secondPassword, wrapper, selection).map(signWithWIF(network, coinDust))
)

export const wifToKeys = curry((network, selection) =>
  over(
    compose(lensProp('inputs'), mapped, Coin.priv),
    (wif) => BitcoinCash.ECPair.fromWIF(wif, network),
    selection
  )
)

// signWithWIF :: network -> selection -> selection
export const signWithWIF = curry((network, coinDust, selection) =>
  compose(signSelection(network, coinDust), sortSelection, wifToKeys(network))(selection)
)
