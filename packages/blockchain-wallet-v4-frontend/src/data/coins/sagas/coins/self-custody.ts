import BIP39 from 'bip39'
import * as Bitcoin from 'bitcoinjs-lib'
import { call } from 'ramda'
import { select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { CoinType } from '@core/types'
import { selectors } from 'data'
import { promptForSecondPassword } from 'services/sagas'

// retrieves the next receive address
export const getNextReceiveAddress = function* (coin: CoinType, networks, index, api: APIType) {
  const password = yield call(promptForSecondPassword)
  const mnemonic = selectors.core.wallet.getMnemonic(yield select(), password)
  const seed = BIP39.mnemonicToSeed(mnemonic)
  // TODO: SELF_CUSTODY
  const { publicKey } = Bitcoin.bip32.fromSeed(seed).derivePath(`m/44'/5757'/0'/0`)
  const pubkey = publicKey.toString('hex')

  const { address } = yield call(api.deriveAddress, coin, pubkey)
  return address
}
