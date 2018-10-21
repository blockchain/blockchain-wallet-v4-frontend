import { BigNumber } from 'bignumber.js'
import * as StellarSdk from 'stellar-sdk'

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
