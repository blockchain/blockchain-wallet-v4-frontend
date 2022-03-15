import BIP39 from 'bip39'
import * as Bitcoin from 'bitcoinjs-lib'
import { call, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { CoinType } from '@core/types'
import { selectors } from 'data'
import { promptForSecondPassword } from 'services/sagas'

const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

export const getSeed = function* () {
  const password = yield call(promptForSecondPassword)
  const getMnemonic = (state) => selectors.core.wallet.getMnemonic(state, password)
  const mnemonicT = yield select(getMnemonic)
  // // @ts-ignore
  const mnemonic = yield call(() => taskToPromise(mnemonicT))
  const seed = BIP39.mnemonicToSeed(mnemonic)

  return seed
}

export const getPubKey = function* () {
  const seed = yield call(getSeed)
  // TODO: SELF_CUSTODY
  const { publicKey } = Bitcoin.bip32.fromSeed(seed).derivePath(`m/44'/5757'/0'/0`)
  const pubkey = publicKey.toString('hex')

  return pubkey
}

export const getPrivKey = function* () {
  const seed = yield call(getSeed)
  // TODO: SELF_CUSTODY
  const { privateKey } = Bitcoin.bip32.fromSeed(seed).derivePath(`m/44'/5757'/0'/0`)
  const privkey = privateKey?.toString('hex')

  return privkey
}

// retrieves the next receive address
export const getNextReceiveAddress = function* (coin: CoinType, networks, index, api: APIType) {
  const pubKey = yield call(getPubKey)
  const { address } = yield call(api.deriveAddress, coin, pubKey)
  return address
}
