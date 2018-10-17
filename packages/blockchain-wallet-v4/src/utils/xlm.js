import { BigNumber } from 'bignumber.js'
import * as StellarSdk from 'stellar-sdk'

export const calculateEffectiveBalance = (
  balance,
  baseReserve,
  entries,
  baseFee,
  operations = 1
) =>
  new BigNumber(balance)
    .minus(new BigNumber(entries).plus(2).mul(baseReserve))
    .minus(new BigNumber(baseFee).mul(operations))
    .toString()

export const isValidAddress = StellarSdk.StrKey.isValidEd25519PublicKey

export const calculateTransactionAmount = (amount, fee) =>
  new BigNumber(amount).add(fee).toString()
