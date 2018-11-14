import { curry, compose, lensProp, forEach, addIndex, over } from 'ramda'
import { mapped } from 'ramda-lens'
import BitcoinCash from 'bitcoinforksjs-lib'
import * as Coin from '../coinSelection/coin.js'
import { fromCashAddr, isCashAddr } from '../utils/bch'
import { addHDWalletWIFS, addLegacyWIFS } from './wifs.js'
import Btc from '@ledgerhq/hw-app-btc'
import * as crypto from '../walletCrypto'

export const signSelection = curry((network, selection) => {
  const hashType =
    BitcoinCash.Transaction.SIGHASH_ALL |
    BitcoinCash.Transaction.SIGHASH_BITCOINCASHBIP143
  const tx = new BitcoinCash.TransactionBuilder(network)
  tx.enableBitcoinCash(true)
  const addInput = coin =>
    tx.addInput(
      coin.txHash,
      coin.index,
      BitcoinCash.Transaction.DEFAULT_SEQUENCE
    )
  const addOutput = coin =>
    tx.addOutput(
      isCashAddr(coin.address) ? fromCashAddr(coin.address) : coin.address,
      coin.value
    )
  const sign = (coin, i) => tx.sign(i, coin.priv, null, hashType, coin.value)
  forEach(addInput, selection.inputs)
  forEach(addOutput, selection.outputs)
  addIndex(forEach)(sign, selection.inputs)
  const signedTx = tx.build()
  return { txHex: signedTx.toHex(), txId: signedTx.getId() }
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
    compose(
      lensProp('inputs'),
      mapped,
      Coin.priv
    ),
    wif => BitcoinCash.ECPair.fromWIF(wif, network),
    selection
  )
)

// signWithWIF :: network -> selection -> selection
export const signWithWIF = curry((network, selection) =>
  compose(
    signSelection(network),
    sortSelection,
    wifToKeys(network)
  )(selection)
)

export const signWithLockbox = function*(
  selection,
  transport,
  scrambleKey,
  changeIndex,
  api
) {
  const BTC = new Btc(transport, scrambleKey)
  let inputs = []
  let paths = []
  const changePath = `44'/145'/0'/M/1/${changeIndex}`
  for (let i in selection.inputs) {
    const coin = selection.inputs[i]
    const txHex = yield api.getBchRawTx(coin.txHash)
    inputs.push([BTC.splitTransaction(txHex), coin.index])
    paths.push("44'/145'/0'" + coin.path.split('M')[1])
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

  const hashType =
    BitcoinCash.Transaction.SIGHASH_ALL |
    BitcoinCash.Transaction.SIGHASH_BITCOINCASHBIP143

  const txHex = yield BTC.createPaymentTransactionNew(
    inputs,
    paths,
    changePath,
    outputs,
    undefined,
    hashType,
    undefined,
    undefined,
    ['abc']
  )
  const txId = crypto
    .sha256(crypto.sha256(Buffer.from(txHex, 'hex')))
    .reverse()
    .toString('hex')
  return { txHex, txId }
}
