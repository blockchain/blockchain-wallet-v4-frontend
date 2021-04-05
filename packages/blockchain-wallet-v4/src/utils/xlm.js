import { BigNumber } from 'bignumber.js'
import BIP39 from 'bip39'
import queryString from 'query-string'
import { assoc } from 'ramda'
import * as StellarSdk from 'stellar-sdk'

export const calculateEffectiveBalance = (balance, reserve, fee) =>
  new BigNumber(balance)
    .minus(reserve)
    .minus(fee)
    .toString()

export const calculateReserve = (baseReserve, entries) =>
  new BigNumber(entries)
    .plus(2)
    .multipliedBy(baseReserve)
    .toString()

export const calculateFee = (baseFee, operations) =>
  new BigNumber(baseFee).multipliedBy(operations).toString()

export const overflowsFullBalance = (amount, effectiveBalance, reserve) =>
  new BigNumber(effectiveBalance).plus(reserve).isLessThan(amount)

export const overflowsEffectiveBalance = (amount, effectiveBalance) =>
  new BigNumber(effectiveBalance).isLessThan(amount)

export const isValidAddress = value => {
  // Exchange address split on : is [address, memo]
  const address = value.split(':')[0]
  return StellarSdk.StrKey.isValidEd25519PublicKey(address)
}

export const calculateTransactionAmount = (amount, fee) =>
  new BigNumber.sum(amount, fee).toString()

export const encodeXlmURI = (address, memo, amount, note) => {
  let data = {}
  if (address) data = assoc('destination', address, data)
  if (amount) data = assoc('amount', amount, data)
  if (note) data = assoc('msg', note, data)
  if (memo) data = assoc('memo', note, data)
  return `web+stellar:pay?${queryString.stringify(data)}`
}

export const decodeXlmURI = uri => {
  if (!/web\+stellar:pay/.test(uri)) return { address: uri }

  const query = uri.replace(/web\+stellar:pay(.*)/, ($0, $1) => $1)
  const { amount, destination, memo, msg } = queryString.parse(query)
  return { address: destination, amount, memo, note: msg }
}

export const getKeyPair = mnemonic => {
  return import(
    /* webpackChunkName: "ed25519" */
    /* webpackMode: "lazy" */
    'ed25519-hd-key'
  ).then(ed25519 => {
    const seed = BIP39.mnemonicToSeed(mnemonic)
    const seedHex = seed.toString('hex')
    const masterKey = ed25519.derivePath("m/44'/148'/0'", seedHex)
    return StellarSdk.Keypair.fromRawEd25519Seed(masterKey.key)
  })
}
