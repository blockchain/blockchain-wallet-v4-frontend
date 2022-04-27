import BIP39 from 'bip39-light'
import * as Bitcoin from 'bitcoinjs-lib'
import { call, select } from 'redux-saga/effects'

import * as selectors from '../../selectors'

const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

export const getSeed = function* (password?: string) {
  const getMnemonic = (state) => selectors.wallet.getMnemonic(state, password)
  const mnemonicT = yield select(getMnemonic)
  // // @ts-ignore
  const mnemonic = yield call(() => taskToPromise(mnemonicT))
  const seed = BIP39.mnemonicToSeed(mnemonic)

  return seed
}

export const getPubKey = function* (password?: string) {
  const seed = yield call(getSeed, password)
  // TODO: SELF_CUSTODY
  const { publicKey } = Bitcoin.bip32.fromSeed(seed).derivePath(`m/44'/5757'/0'/0/0`)
  const pubkey = publicKey.toString('hex')

  return pubkey
}

export const getPrivKey = function* (password?: string) {
  const seed = yield call(getSeed, password)
  // TODO: SELF_CUSTODY
  const { privateKey } = Bitcoin.bip32.fromSeed(seed).derivePath(`m/44'/5757'/0'/0/0`)
  const privkey = privateKey?.toString('hex')

  return privkey
}
