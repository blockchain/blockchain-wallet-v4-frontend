import { curry, compose, lensProp, forEach, addIndex, over } from 'ramda'
import { mapped } from 'ramda-lens'
import BitcoinCash from 'bitcoinforksjs-lib'
import * as Coin from '../coinSelection/coin.js'
// import { isFromAccount } from '../coinSelection'
import { fromCashAddr, isCashAddr } from '../utils/bch'
import { addHDWalletWIFS, addLegacyWIFS } from './wifs.js'

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
  const signedTx = tx.build()
  return { txHex: signedTx.toHex(), txId: signedTx.getId() }
})

// signHDWallet :: network -> password -> wrapper -> selection -> Task selection
export const signHDWallet = curry((network, secondPassword, wrapper, selection) =>
  addHDWalletWIFS(network, secondPassword, wrapper, selection)
    .map(signWithWIF(network))
)

// signLegacy :: network -> password -> wrapper -> selection -> Task selection
export const signLegacy = curry((network, secondPassword, wrapper, selection) =>
  addLegacyWIFS(network, secondPassword, wrapper, selection)
    .map(signWithWIF(network))
)

export const wifToKeys = curry((network, selection) =>
  over(
    compose(lensProp('inputs'), mapped, Coin.priv),
    wif => BitcoinCash.ECPair.fromWIF(wif, network),
    selection)
)

// signWithWIF :: network -> selection -> selection
export const signWithWIF = curry((network, selection) =>
  compose(signSelection(network), wifToKeys(network))(selection)
)
