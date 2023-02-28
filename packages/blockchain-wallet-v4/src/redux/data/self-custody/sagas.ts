import BIP39 from 'bip39-light'
import * as Bitcoin from 'bitcoinjs-lib'
import { call, select } from 'redux-saga/effects'

import * as selectors from '../../selectors'

const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

// this should ideally come from a backend service
// if we want to expand the functionality of
// the pubkey service for building transactions
// we need to know the correct derivation paths
// for each coin that the service supports.
const getPath = (coin) => {
  if (coin.includes('MATIC')) {
    return `m/44'/60'/0'/0/0`
  }
  if (coin === 'STX') {
    return `m/44'/5757'/0'/0/0`
  }

  throw new Error('Could not get path for coin.')
}

export const getSeed = function* (password?: string) {
  const getMnemonic = (state) => selectors.wallet.getMnemonic(state, password)
  const mnemonicT = yield select(getMnemonic)
  // // @ts-ignore
  const mnemonic = yield call(() => taskToPromise(mnemonicT))
  const seed = BIP39.mnemonicToSeed(mnemonic)

  return seed
}

export const getMnemonic = function* (password?: string) {
  const getMnemonic = (state) => selectors.wallet.getMnemonic(state, password)
  const mnemonicT = yield select(getMnemonic)
  // // @ts-ignore
  const mnemonic = yield call(() => taskToPromise(mnemonicT))

  return mnemonic
}

export const getPubKey = function* (coin: string, password?: string) {
  const seed = yield call(getSeed, password)
  const { publicKey } = Bitcoin.bip32.fromSeed(seed).derivePath(getPath(coin))
  const pubkey = publicKey.toString('hex')

  return pubkey
}

export const getPrivKey = function* (coin: string, password?: string) {
  const seed = yield call(getSeed, password)
  const { privateKey } = Bitcoin.bip32.fromSeed(seed).derivePath(getPath(coin))
  const privkey = privateKey?.toString('hex')

  return privkey
}
