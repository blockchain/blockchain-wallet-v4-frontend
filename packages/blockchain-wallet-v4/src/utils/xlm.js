import { BigNumber } from 'bignumber.js'
import * as StellarSdk from 'stellar-sdk'
import queryString from 'query-string'
import { assoc } from 'ramda'

export const calculateEffectiveBalance = (balance, reserve, fee) =>
  new BigNumber(balance)
    .minus(reserve)
    .minus(fee)
    .toString()

export const calculateReserve = (baseReserve, entries) =>
  new BigNumber(entries)
    .plus(2)
    .mul(baseReserve)
    .toString()

export const calculateFee = (baseFee, operations) =>
  new BigNumber(baseFee).mul(operations).toString()

export const overflowsFullBalance = (amount, effectiveBalance, reserve) =>
  new BigNumber(effectiveBalance).plus(reserve).lessThan(amount)

export const overflowsEffectiveBalance = (amount, effectiveBalance) =>
  new BigNumber(effectiveBalance).lessThan(amount)

export const isValidAddress = StellarSdk.StrKey.isValidEd25519PublicKey

export const calculateTransactionAmount = (amount, fee) =>
  new BigNumber(amount).add(fee).toString()

export const encodeXlmURI = (address, memo, amount, note) => {
  let data = {}
  if (address) data = assoc('destination', address, data)
  if (amount) data = assoc('amount', amount, data)
  if (note) data = assoc('msg', note, data)
  if (memo) data = assoc('memo', note, data)
  return `web+stellar:pay?${queryString.stringify(data)}`
}

export const decodeXlmURI = uri => {
  const query = uri.replace(/web\+stellar:pay(.*)/, ($0, $1) => $1)
  const { destination, amount, memo, msg } = queryString.parse(query)
  return { address: destination, amount, memo, note: msg }
}
