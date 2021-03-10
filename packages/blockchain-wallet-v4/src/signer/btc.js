import Btc from '@ledgerhq/hw-app-btc'
import Bitcoin from 'bitcoinjs-lib'
import BitcoinMessage from 'bitcoinjs-message'
import {
  addIndex,
  compose,
  curry,
  defaultTo,
  forEach,
  lensProp,
  over
} from 'ramda'
import { mapped } from 'ramda-lens'

import * as Coin from '../coinSelection/coin.js'
import { privateKeyStringToKey } from '../utils/btc'
import * as crypto from '../walletCrypto'
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
  return {
    txHex: signedTx.toHex(),
    txId: signedTx.getId(),
    weightedSize: signedTx.weight() / 4
  }
})

export const sortSelection = selection => ({
  ...selection,
  inputs: Coin.bip69SortInputs(selection.inputs),
  outputs: Coin.bip69SortOutputs(selection.outputs)
})

// signHDWallet :: network -> password -> wrapper -> selection -> Task selection
export const signHDWallet = curry(
  (network, secondPassword, wrapper, selection) =>
    addHDWalletWIFS(network, secondPassword, wrapper, selection).map(
      signWithWIF(network)
    )
)

// signLegacy :: network -> password -> wrapper -> selection -> Task selection
export const signLegacy = curry((network, secondPassword, wrapper, selection) =>
  addLegacyWIFS(network, secondPassword, wrapper, selection).map(
    signWithWIF(network)
  )
)

export const wifToKeys = curry((network, selection) =>
  over(
    compose(lensProp('inputs'), mapped, Coin.priv),
    wif => Bitcoin.ECPair.fromWIF(wif, network),
    selection
  )
)

// signWithWIF :: network -> selection -> selection
export const signWithWIF = curry((network, selection) =>
  compose(signSelection(network), sortSelection, wifToKeys(network))(selection)
)

export const signMessage = (priv, addr, message) => {
  const keyPair = privateKeyStringToKey(priv, 'base58', null, addr)
  const privateKey = keyPair.d.toBuffer(32)
  return BitcoinMessage.sign(message, privateKey, keyPair.compressed).toString(
    'base64'
  )
}

export const signWithLockbox = function * (
  selection,
  transport,
  scrambleKey,
  changeIndex,
  api
) {
  const BTC = new Btc(transport, scrambleKey)
  let inputs = []
  let paths = []
  const changePath = `44'/0'/0'/M/1/${changeIndex}`
  for (let i in selection.inputs) {
    const coin = selection.inputs[i]
    const txHex = yield api.getRawTx(coin.txHash)
    inputs.push([BTC.splitTransaction(txHex, true), coin.index])
    paths.push("44'/0'/0'" + coin.path.split('M')[1])
  }

  const intToHex = i => {
    const hex = i.toString(16)
    return hex.length > 1 ? hex : '0' + hex
  }

  let outputs = intToHex(selection.outputs.length)
  selection.outputs.map(coin => {
    let amount = Buffer.alloc(8)
    amount.writeUInt32LE(coin.value)
    outputs +=
      amount.toString('hex') +
      intToHex(coin.script.length) +
      coin.script.toString('hex')
  })

  const txHex = yield BTC.createPaymentTransactionNew(
    inputs,
    paths,
    changePath,
    outputs
  )
  const txId = crypto
    .sha256(crypto.sha256(Buffer.from(txHex, 'hex')))
    .reverse()
    .toString('hex')
  return { txHex, txId }
}
