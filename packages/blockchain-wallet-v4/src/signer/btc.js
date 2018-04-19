import Bitcoin from 'bitcoinjs-lib'
import { mapped } from 'ramda-lens'
import { curry, forEach, addIndex, defaultTo, over, compose, lensProp } from 'ramda'

import * as Coin from '../coinSelection/coin.js'
import { addHDWalletWIFS, addLegacyWIFS } from './wifs.js'

export const signSelection = curry((network, selection) => {
  const tx = new Bitcoin.TransactionBuilder(network)
  const addInput = coin => tx.addInput(coin.txHash, coin.index)
  const addOutput = coin =>
    tx.addOutput(defaultTo(coin.address, coin.script), coin.value)
  const sign = (coin, i) => tx.sign(i, coin.priv)
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
    wif => Bitcoin.ECPair.fromWIF(wif, network),
    selection)
)

// signWithWIF :: network -> selection -> selection
export const signWithWIF = curry((network, selection) =>
  compose(signSelection(network), wifToKeys(network))(selection)
)
