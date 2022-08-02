import BIP39 from 'bip39-light'
import { ethers } from 'ethers'
import { getSessionPayload } from 'plugin/internal/chromeStorage'
import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { getPrivateKey } from '@core/utils/eth'
import { WALLET_SIGNER_ERR } from 'data/components/nfts/sagas'

import { actions as A } from './slice'

export const logLocation = 'components/nfts/sagas'
const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }: { api: APIType }) => {
  const getWallet = function* () {
    try {
      const wrapper = yield getSessionPayload()
      const mnemonic = BIP39.entropyToMnemonic(wrapper.wallet.hd_wallets._tail.array[0].seedHex)
      const privateKey = getPrivateKey(mnemonic)
      const wallet = new ethers.Wallet(privateKey, api.ethProvider)
      yield put(A.setWallet(wallet))
      return wallet
    } catch (e) {
      throw new Error(WALLET_SIGNER_ERR)
    }
  }

  const getPublicAddress = function* () {
    try {
      const signer: ethers.Wallet = yield call(getWallet)
      const address = yield signer.getAddress()
      yield put(A.setPublicAddress(address))
    } catch (e) {
      throw new Error(`Failed to get address. ${e}`)
    }
  }

  return {
    getPublicAddress,
    getWallet
  }
}
