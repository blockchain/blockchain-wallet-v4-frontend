import { BigNumber } from 'bignumber.js'
import * as StellarSdk from 'stellar-sdk'
import BIP39 from 'bip39'
import * as ed25519 from 'ed25519-hd-key'

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

export const getKeyPair = mnemonic => {
  console.log(mnemonic)
  const seed = BIP39.mnemonicToSeed(mnemonic)
  const seedHex = seed.toString('hex')
  const masterKey = ed25519.derivePath("m/44'/148'/0'", seedHex)
  return StellarSdk.Keypair.fromRawEd25519Seed(masterKey.key)
}
