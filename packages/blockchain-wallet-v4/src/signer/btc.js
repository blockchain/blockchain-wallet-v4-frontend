import * as Bitcoin from 'bitcoinjs-lib'
import BitcoinMessage from 'bitcoinjs-message'
import { addIndex, compose, curry, defaultTo, forEach, lensProp, over } from 'ramda'
import { mapped } from 'ramda-lens'

import * as Coin from '../coinSelection/coin.js'
import { privateKeyStringToKey } from '../utils/btc'
import { addHDWalletWIFS, addLegacyWIFS } from './wifs.js'

const getOutputScript = (keyPair) => {
  const pubKey = keyPair.publicKey
  const payment = Bitcoin.payments.p2wpkh({ pubkey: pubKey })
  return payment.output
}

export const signSelection = curry((network, selection) => {
  const tx = new Bitcoin.TransactionBuilder(network)

  const addOutput = (coin) => tx.addOutput(defaultTo(coin.address, coin.script), coin.value)
  const addInput = (coin) => {
    switch (coin.type()) {
      case 'P2WPKH':
        return tx.addInput(coin.txHash, coin.index, 0xffffffff, getOutputScript(coin.priv))
      default:
        return tx.addInput(coin.txHash, coin.index)
    }
  }
  const sign = (coin, i) => {
    switch (coin.type()) {
      case 'P2WPKH':
        return tx.sign(i, coin.priv, null, null, coin.value)
      default:
        return tx.sign(i, coin.priv)
    }
  }

  forEach(addInput, selection.inputs)
  forEach(addOutput, selection.outputs)
  addIndex(forEach)(sign, selection.inputs)
  const signedTx = tx.build()
  return {
    txHex: signedTx.toHex(),
    txId: signedTx.getId(),
    weightedSize: signedTx.weight() / 4
  }
})

export const sortSelection = (selection) => ({
  ...selection,
  inputs: Coin.bip69SortInputs(selection.inputs),
  outputs: Coin.bip69SortOutputs(selection.outputs)
})

// signHDWallet :: network -> password -> wrapper -> selection -> Task selection
export const signHDWallet = curry((network, secondPassword, wrapper, selection) =>
  addHDWalletWIFS(network, secondPassword, wrapper, selection).map(signWithWIF(network))
)

// signLegacy :: network -> password -> wrapper -> selection -> Task selection
export const signLegacy = curry((network, secondPassword, wrapper, selection) =>
  addLegacyWIFS(network, secondPassword, wrapper, selection).map(signWithWIF(network))
)

export const wifToKeys = curry((network, selection) =>
  over(
    compose(lensProp('inputs'), mapped, Coin.priv),
    (wif) => Bitcoin.ECPair.fromWIF(wif, network),
    selection
  )
)

// signWithWIF :: network -> selection -> selection
export const signWithWIF = curry((network, selection) =>
  compose(signSelection(network), sortSelection, wifToKeys(network))(selection)
)

export const signMessage = (priv, addr, message) => {
  const keyPair = privateKeyStringToKey(priv, 'base58', null, addr)
  const { privateKey } = keyPair
  return BitcoinMessage.sign(message, privateKey, keyPair.compressed).toString('base64')
}
